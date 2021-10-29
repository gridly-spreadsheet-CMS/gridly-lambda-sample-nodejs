// For test.

const express = require("express");
const app = express();
const port = 8000;

const { fileHandler, speechHandler } = require("./index");

app.get("/file", async (req, res) => {
  const result = await fileHandler({
    viewId: "ew14yy0oey2xzkl",
    inputColumnId: "id",
    outputColumnId: "col_robot",
  });

  res.send(result);
});

app.get("/speech", async (req, res) => {
  const result = await speechHandler({
    viewId: "ew14yy0oey2xzkl",
    inputColumnId: "col_text",
    outputColumnId: "col_voice",
    data: {
      id: "robot-2-giant",
      columnChanges: ["col_text"],
      cells: [
        {
          columnId: "col_text",
          value: "thanks you",
        },
      ],
    },
  });

  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
