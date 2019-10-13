import { ISeoData } from "types/response";
import { PR, OK, ERR } from "types/data";
import * as csv from "csvtojson";
import { validateJsonData } from "helpers/responseValidator";
import { NO_DATA_PROVIDED_FOR_UPLOAD } from "constants/errors";

export async function extractJsonFromCsv(
  data: string | null
): PR<ISeoData, string> {
  if (!data) return new ERR(NO_DATA_PROVIDED_FOR_UPLOAD);

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
    ...jsonData,
    data
  };
}
