const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const config = require("../_config");

const MAX_RETRY = 3;
const { API_URL, API_KEY } = config.GRIDLY;

const _get = async (url, retryCount = 0) => {
  const headers = {
    Accept: "application/json;",
    "Content-Type": "application/json;",
    Authorization: `ApiKey ${API_KEY}`,
  };

  try {
    const response = await axios.get(url, { headers });

    return response;
  } catch (error) {
    console.log(`FAILED: [GridlyClient] Fetch ${error}`);

    if (retryCount < MAX_RETRY) {
      return _get(url, retryCount + 1);
    } else {
      throw error;
    }
  }
};

const _update = async (url, data) => {
  const headers = {
    Accept: "application/json;",
    "Content-Type": "application/json;",
    Authorization: `ApiKey ${API_KEY}`,
  };

  try {
    const response = await axios.patch(url, JSON.stringify(data), {
      headers,
    });

    return response;
  } catch (error) {
    console.log(`FAILED: [GridlyClient] Patch ${error}`);
    throw error;
  }
};

const _upload = async (url, data) => {
  const headers = {
    Accept: "application/json;",
    "Content-Type": "application/json;",
    Authorization: `ApiKey ${API_KEY}`,
    ...data.getHeaders(),
  };

  try {
    const response = await axios.post(url, data, { headers });

    return response;
  } catch (error) {
    console.log(`FAILED: [GridlyClient] Upload ${error}`);
    throw error;
  }
};

const getRecords = async (viewId) => {
  let url = `${API_URL}/views/${viewId}/records`;

  const MAX_LIMIT = 1000;
  const list = [];
  let totalRecord = 0;
  let indexRecord = 0;

  do {
    const params = {
      offset: indexRecord,
      limit: MAX_LIMIT,
    };
    const response = await _get(
      url + `?page=${encodeURI(JSON.stringify(params))}`
    );
    const records = response.data ? response.data : [];

    list.push(...records);

    totalRecord = response.headers["x-total-count"]
      ? parseInt(response.headers["x-total-count"])
      : 0;
    indexRecord = indexRecord + MAX_LIMIT;
  } while (indexRecord < totalRecord);

  const builtRecords = list.map((record) => {
    const obj = {};

    obj.id = record.id;
    obj.columns = {
      id: record.id,
    };

    record.cells.forEach((cell) => {
      obj.columns[cell.columnId] = cell.value;
    });

    return obj;
  });

  return builtRecords;
};

const updateRecord = async (viewId, data) => {
  const url = `${API_URL}/views/${viewId}/records`;
  return _update(url, data);
};

const uploadFile = async ({ viewId, recordId, columnId, filePath }) => {
  const url = `${API_URL}/views/${viewId}/files`;
  const data = new FormData();
  data.append("recordId", recordId);
  data.append("columnId", columnId);
  data.append("file", fs.createReadStream(filePath));

  await _upload(url, data);

  return filePath;
};

module.exports = {
  getRecords,
  updateRecord,
  uploadFile,
};
