import { PR, OK, ERR } from "types/data";
import * as csv from "csvtojson";
import { validatePostData } from "helpers/responseValidator";
import { NO_DATA_PROVIDED_FOR_UPLOAD } from "constants/errors";
import { uploadJsonToS3 } from "helpers/s3PutUtils";

export async function processUploadData(
  data: string | null
): PR<string, string> {
  if (!data) return new ERR(NO_DATA_PROVIDED_FOR_UPLOAD);

  let isSuccess = null;
  try {
    const allS3Handlers = await Promise.all(putDataToS3(data));
    isSuccess = new OK(JSON.stringify(allS3Handlers));
  } catch (error) {
    isSuccess = new ERR(JSON.stringify(error));
  }
  return isSuccess;
}

function putDataToS3(
  requestData: string | null
): Promise<AWS.S3.PutObjectOutput>[] {
  const rawData = JSON.parse(requestData);
  const rawDataList = Array.isArray(rawData) ? rawData : [rawData];
  return rawDataList.map(async rawData => {
    validatePostData(rawData);
    const data = await csv().fromString(rawData.data);
    const seoData = { ...rawData, data };
    return await uploadJsonToS3(seoData);
  });
}
