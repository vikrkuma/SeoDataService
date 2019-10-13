import { ISeoKey, PathParameters, ISeoData } from "types/response";
import { PR, OK, ERR } from "types/data";
import * as AWS from "aws-sdk";
import { validateJsonData } from "helpers/jsonUtils";

const S3 = new AWS.S3();
const BUCKET = process.env.Bucket;

export async function getS3Object(
  pathParameters: PathParameters
): PR<string, string> {
  let response = null;
  try {
    const resourcePrefix = getResourcePrefix(pathParameters);
    response = new OK(await listS3Objects(resourcePrefix));
  } catch (error) {
    response = new ERR(error);
  }
  return response;
}

async function listS3Objects(resourcePrefix: ISeoKey): Promise<string> {
  const params = {
    Bucket: BUCKET,
    Delimiter: "",
    Prefix: `${resourcePrefix.resourceId}/${resourcePrefix.objectId}-v`
  };
  return S3.listObjectsV2(params)
    .promise()
    .then(response => JSON.stringify(response))
    .catch(error => JSON.stringify(error));
}

function getResourcePrefix(pathParameters: PathParameters): ISeoKey {
  if (!pathParameters) throw "Path parameters not found!";

  const resourcePrefix = {
    resourceId: pathParameters.resourceId,
    objectId: pathParameters.objectId,
    cacheId: pathParameters.cacheId
  };
  validateJsonData(resourcePrefix as ISeoData, true);
  return resourcePrefix;
}
