// Load environment variables from the `.env` file.
require("dotenv").config();

const CONFIGS = {
  SLACK_HOOK: "",
  GRIDLY: {
    API_URL: "https://api.gridly.com/v1",
    API_KEY: process.env.GRIDLY_API_KEY,
  },
  G_KEY_PATH: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};

module.exports = CONFIGS;
