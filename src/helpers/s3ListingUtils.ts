import { PathParameters } from "types/response";
import { IResourceIdentifier, SeoS3ObjectName } from "types/s3Objects";
import { PR, OK, ERR } from "types/data";
import * as AWS from "aws-sdk";
import { validateJsonData } from "helpers/responseValidator";
import { isValid, format } from "date-fns";
import { YYYYMMDDHHMMSS, DATE_END_GETTER } from "constants/date";
import {
  NO_FILE_FOUND,
  NO_PATH_PARAMETERS,
  INCORRECT_CACHE_LENGTH,
  INCORRECT_CACHE_FORMAT
} from "constants/errors";
import {
  ALL_NON_NUMERICS,
  AFTER_EVERY_EIGHTH_NUMBER,
  EMPTY_STRING,
  SPACE_AFTER_FIRST_MATCH
} from "constants/regex";
import { getObjectKeyPrefix } from "helpers/filenameUtils";

const S3 = new AWS.S3();
const BUCKET = process.env.Bucket;

export async function getS3Object(
  pathParameters: PathParameters
): PR<SeoS3ObjectName, string> {
  let response = null;
  try {
    const resourcePrefix = getResourcePrefix(pathParameters);
    response = new OK(await listS3Objects(resourcePrefix));
  } catch (error) {
    response = new ERR(JSON.stringify(error));
  }
  return response;
}

async function listS3Objects(
  resourcePrefix: IResourceIdentifier
): Promise<SeoS3ObjectName> {
  const params = {
    Bucket: BUCKET,
    Delimiter: EMPTY_STRING,
    Prefix: getObjectKeyPrefix(resourcePrefix)
  };
  const objectList = await S3.listObjectsV2(params).promise();
  return filterS3ObjectList(objectList, resourcePrefix);
}

function filterS3ObjectList(
  { Contents }: AWS.S3.ListObjectsV2Output,
  resourcePrefix: IResourceIdentifier
): SeoS3ObjectName {
  const fileObject = Contents.reverse().find(object =>
    filterObjects(object, resourcePrefix)
  );

  if (!fileObject) throw NO_FILE_FOUND;

  return {
    key: fileObject.Key,
    etag: fileObject.ETag,
    size: fileObject.Size
  };
}

function filterObjects(
  fileObject: AWS.S3.Object,
  resourcePrefix: IResourceIdentifier
): boolean {
  if (!resourcePrefix.cacheId) return true;

  const splitKey = getObjectKeyPrefix(resourcePrefix);
  const compareKey = Number(
    fileObject.Key.replace(splitKey, EMPTY_STRING).replace(
      ALL_NON_NUMERICS,
      EMPTY_STRING
    )
  );
  return resourcePrefix.cacheId >= compareKey;
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
  validateJsonData(resourcePrefix, true);
  return resourcePrefix;
}

function getCacheId(cacheId?: string): number | null {
  if (!cacheId) return null;

  let possibleDateTime = cacheId
    .replace(ALL_NON_NUMERICS, EMPTY_STRING)
    .replace(AFTER_EVERY_EIGHTH_NUMBER, SPACE_AFTER_FIRST_MATCH)
    .trim();

  if (!(possibleDateTime.length in DATE_END_GETTER)) {
    throw INCORRECT_CACHE_LENGTH;
  }

  const date = DATE_END_GETTER[possibleDateTime.length](possibleDateTime);
  if (!isValid(date)) throw INCORRECT_CACHE_FORMAT;

  return Number(format(date, YYYYMMDDHHMMSS));
}
