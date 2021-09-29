// For test.

const express = require("express");
const app = express();
const port = 8000;

const { handler } = require("./index");

app.get("/", async (req, res) => {
  try {
    handler({
      viewId: "xnd0yxjdvwl949d",
      inputColumnId: "id",
      outputColumnId: "col_robot",
    });

    res.send(JSON.stringify("SUCCESS"));
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
