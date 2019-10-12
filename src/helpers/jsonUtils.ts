import { ISeoData } from "types/response";
import { PR, OK, ERR } from "types/data";
import * as csv from "csvtojson";

export async function extractJsonFromCsv(
  data: string | null
): PR<ISeoData, string> {
  if (!data) return new ERR("No data provided!");

  let parsedCsv = null;
  try {
    parsedCsv = new OK(await getJsonData(data));
  } catch (error) {
    parsedCsv = new ERR(error);
  }
  return parsedCsv;
}

/** Parses the api request body and convert the given csv to json format. */
async function getJsonData(requestData: string): Promise<ISeoData> {
  const jsonData = JSON.parse(requestData);
  validateJsonData(jsonData);
  const data = await csv().fromString(jsonData.data);
  return {
    key: jsonData.key,
    data
  };
}

/** Validates that all the required fields are present in request payload. */
function validateJsonData(jsonData: ISeoData) {
  if (!jsonData.key) {
    throw "Invalid data provided. [key] property not found!";
  }
  if (!jsonData.data) {
    throw "Invalid data provided. [data] property not provided/invalid!";
  }
}
