const fs = require("fs");
const os = require("os");
const path = require("path");
const { google } = require("googleapis");
const drive = google.drive("v3");
const { G_KEY_PATH } = require("../_config");

async function getFiles() {
  // Obtain user credentials to use for the request
  const auth = new google.auth.GoogleAuth({
    keyFile: G_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
  });
  google.options({ auth });

  const params = { pageSize: 1000 };
  params.q = "";
  const res = await drive.files.list(params);

  return res.data ? res.data.files : [];
}

async function downloadFile(fileName, fileId) {
  const auth = new google.auth.GoogleAuth({
    keyFile: G_KEY_PATH,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive.photos.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
  google.options({ auth });
  const filePath = path.join(os.tmpdir(), fileName);
  const dest = fs.createWriteStream(filePath);

  return drive.files
    .get({ fileId, alt: "media" }, { responseType: "stream" })
    .then((res) => {
      return new Promise((resolve, reject) => {
        let progress = 0;

        res.data
          .on("end", () => {
            console.log("Done downloading file.");
            resolve(filePath);
          })
          .on("error", (err) => {
            console.error("Error downloading file.");
            reject(err);
          })
          .on("data", (d) => {
            progress += d.length;
            if (process.stdout.isTTY) {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`Downloaded ${progress} bytes`);
            }
          })
          .pipe(dest);
      });
    });
}

module.exports = {
  getFiles,
  downloadFile,
};
