const fs = require("fs");

const {
  getRecords,
  updateRecord,
  uploadFile,
} = require("./services/gridlyApi");
const { getFiles, downloadFile } = require("./services/gdrive");
const { textToAudio } = require("./services/gcloud");

// Load files from GDrive to Gridly
const fileHandler = async (event) => {
  try {
    const { viewId, inputColumnId, outputColumnId } = event;

    const gridlyRecords = await getRecords(viewId);
    const gFiles = await getFiles();

    for (let i = 0; i < gridlyRecords.length; i++) {
      const record = gridlyRecords[i];
      const recordId = record.id;
      const columns = record.columns;
      const fileName = columns[inputColumnId];
      const gFile = gFiles.find((fileObj) => {
        return fileObj.name && fileObj.name.toLowerCase().includes(fileName);
      });

      if (gFile) {
        const fileName = gFile.name;
        const fileId = gFile.id;

        const filePath = await downloadFile(fileName, fileId);

        const emptyCellData = [
          {
            id: recordId,
            cells: [{ columnId: outputColumnId, value: [] }],
          },
        ];
        await updateRecord(viewId, emptyCellData);

        await uploadFile({
          viewId,
          recordId,
          columnId: outputColumnId,
          filePath: filePath,
        });

        await fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
};

// Text to Speech
const speechHandler = async (event) => {
  try {
    const { viewId, inputColumnId, outputColumnId, data } = event;
    const { id, columnChanges, cells } = data;

    if (columnChanges.includes(inputColumnId)) {
      const updatedCell = cells.find((cell) => cell.columnId === inputColumnId);

      if (updatedCell) {
        const text = updatedCell.value;
        const emptyCellData = [
          {
            id,
            cells: [{ columnId: outputColumnId, value: [] }],
          },
        ];

        await updateRecord(viewId, emptyCellData);

        if (text) {
          const filePath = await textToAudio(text);

          await uploadFile({
            viewId,
            recordId: id,
            columnId: outputColumnId,
            filePath: filePath,
          });

          await fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
};

module.exports = {
  fileHandler,
  speechHandler,
};
