import { ISeoData } from "types/response";
import { PR, OK, ERR } from "types/data";
import * as AWS from "aws-sdk";
import { format } from "date-fns";

const S3 = new AWS.S3();
const BUCKET = process.env.Bucket;
const DATA_TYPE = "application/json";

export const uploadJsonToS3 = async (seoData: ISeoData): PR<string, string> => {
  const nowDate = format(new Date(), "yyyyMMddHHmmss");
  const fileName = `${seoData.objectId}-v${nowDate}.json`;
  const key = `${seoData.resourceId}/${fileName}`;
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
