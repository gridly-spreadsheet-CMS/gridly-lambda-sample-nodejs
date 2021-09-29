const CONFIGS = {
  dev: {
    MARKETING_SLACK_HOOK: "",
    GRIDLY: {
      API_URL: "https://api.gridly.com/v1",
      API_KEY: "{YOUR_GRIDLY_API_KEY}",
    },
  },
  prod: {
    MARKETING_SLACK_HOOK: "",
    GRIDLY: {
      API_URL: "https://api.gridly.com/v1",
      API_KEY: "HfhioJ4Z2AY",
    },
  },
};

module.exports = CONFIGS["prod"];
