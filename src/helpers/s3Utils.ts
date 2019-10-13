import { ISeoData } from "types/response";
import { PR, OK, ERR } from "types/data";
import * as AWS from "aws-sdk";
import { format } from "date-fns";
import { YYYYMMDDHHMMSS } from "constants/date";
import { DATA_TYPE } from "constants/response";
import { JSONFileExt } from "constants/fileTypes";
import { getObjectKeyPrefix } from "helpers/filenameUtils";

const S3 = new AWS.S3();
const BUCKET = process.env.Bucket;

export const uploadJsonToS3 = async (seoData: ISeoData): PR<string, string> => {
  const nowDate = format(new Date(), YYYYMMDDHHMMSS);
  const keyPrefix = getObjectKeyPrefix(seoData);
  const key = `${keyPrefix}${nowDate}${JSONFileExt}`;
  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: Buffer.from(JSON.stringify(seoData.data)),
    ContentType: DATA_TYPE
  };
  return S3.putObject(params)
    .promise()
    .then(response => new OK(JSON.stringify(response)))
    .catch(error => new ERR(JSON.stringify(error)));
};
