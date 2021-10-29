const speech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const os = require("os");
const util = require("util");
const path = require("path");
const uuidV4 = require("uuid/v4");

const speechClient = new speech.TextToSpeechClient();

const CONFIG = {
  outputFolder: os.tmpdir(),
  languageCode: "en-US",
  ssmlGender: "FEMALE",
};

const textToAudio = async (text, targetLang = CONFIG.languageCode) => {
  // Add one or more effects profiles to array.
  // Refer to documentation for more details:
  // https://cloud.google.com/text-to-speech/docs/audio-profiles
  const effectsProfileId = ["telephony-class-application"];
  const fileName = `${uuidV4()}.mp3`;
  let filePath = path.join(CONFIG.outputFolder, fileName);

  const request = {
    input: { text: text },
    voice: { languageCode: targetLang, ssmlGender: CONFIG.ssmlGender },
    audioConfig: {
      audioEncoding: "MP3",
      effectsProfileId: effectsProfileId,
    },
  };

  try {
    const [response] = await speechClient.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);

    await writeFile(filePath, response.audioContent, "binary");

    console.log(`Audio content written to file: ${filePath}`);
  } catch (error) {
    console.log(error);
    filePath = null;
  }

  return filePath;
};

module.exports = {
  textToAudio,
};
