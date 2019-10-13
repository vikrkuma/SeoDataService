import { SeoS3ObjectName } from "types/s3Objects";
import { PR, OK, ERR } from "types/data";
import * as AWS from "aws-sdk";
import { UTF_8 } from "constants/encodings";

const S3 = new AWS.S3();
const BUCKET = process.env.Bucket;

export const getS3ObjectContent = async (
  fileObject: SeoS3ObjectName
): PR<string, string> => {
  const params = {
    Bucket: BUCKET,
    Key: fileObject.key
  };
  try {
    const objectData = await S3.getObject(params).promise();
    return new OK(objectData.Body.toString(UTF_8));
  } catch (error) {
    return new ERR(JSON.stringify(error));
  }
};
