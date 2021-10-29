const axios = require("axios");
const { SLACK_HOOK } = require("../_config");

const notify = async (message) => {
  try {
    const config = {
      method: "post",
      url: SLACK_HOOK,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ text: message }),
    };

    return await axios(config);
  } catch (error) {
    return error;
  }
};

module.exports = {
  notify,
};
