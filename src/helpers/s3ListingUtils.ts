import { PathParameters } from "types/response";
import { IResourceIdentifier, SeoS3ObjectName } from "types/s3Objects";
import { PR, OK, ERR } from "types/data";
import * as AWS from "aws-sdk";
import { validateRequestParameter } from "helpers/responseValidator";
import { NO_FILE_FOUND, NO_PATH_PARAMETERS } from "constants/errors";
import { getObjectKeyPrefix } from "helpers/filenameUtils";
import {
  getCacheId,
  cacheIdToVersionComparator,
  getSeoS3ObjectName
} from "helpers/cacheUtils";

const S3 = new AWS.S3();
const BUCKET = process.env.Bucket;

export async function getS3Object(
  pathParameters: PathParameters
): PR<SeoS3ObjectName, string> {
  let response = null;
  try {
    const resourcePrefix = getResourcePrefix(pathParameters);
    response = new OK(await listS3Object(resourcePrefix));
  } catch (error) {
    response = new ERR(JSON.stringify(error));
  }
  return response;
}

function getResourcePrefix(
  pathParameters: PathParameters
): IResourceIdentifier {
  if (!pathParameters) throw NO_PATH_PARAMETERS;

  const resourcePrefix = {
    resourceId: pathParameters.resourceId,
    objectId: pathParameters.objectId,
    cacheId: getCacheId(pathParameters.cacheId)
  };
  validateRequestParameter(resourcePrefix);
  return resourcePrefix;
}

async function listS3Object(
  resourcePrefix: IResourceIdentifier
): Promise<SeoS3ObjectName> {
  const params = {
    Bucket: BUCKET,
    Prefix: getObjectKeyPrefix(resourcePrefix)
  };
  const objectList = await S3.listObjectVersions(params).promise();
  return filterS3ObjectList(objectList, resourcePrefix);
}

function filterS3ObjectList(
  { Versions }: AWS.S3.ListObjectVersionsOutput,
  resourcePrefix: IResourceIdentifier
): SeoS3ObjectName {
  const fileObject = Versions.find(objectVersion =>
    cacheIdToVersionComparator(objectVersion, resourcePrefix)
  );

  if (!fileObject) throw NO_FILE_FOUND;

  return getSeoS3ObjectName(fileObject);
}
