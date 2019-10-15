import { ISeoData } from "types/response";
import * as AWS from "aws-sdk";
import { DATA_TYPE } from "constants/response";
import { getObjectKeyPrefix } from "helpers/filenameUtils";

const S3 = new AWS.S3();
const BUCKET = process.env.Bucket;

export const uploadJsonToS3 = async (
  seoData: ISeoData
): Promise<AWS.S3.PutObjectOutput> => {
  const params = {
    Bucket: BUCKET,
    Key: getObjectKeyPrefix(seoData),
    Body: Buffer.from(JSON.stringify(seoData.data)),
    ContentType: DATA_TYPE
  };
  return S3.putObject(params).promise();
};
