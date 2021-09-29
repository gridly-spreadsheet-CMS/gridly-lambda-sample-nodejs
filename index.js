const { getRecords, updateRecord, uploadFile } = require("./gridlyApi");
const { getFiles, downloadFile } = require("./gdrive");
const fs = require("fs");

const handler = async (event) => {
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

module.exports = {
  handler,
};
