import { isValid } from "date-fns";
import { DATE_END_GETTER } from "constants/date";
import { plainDateFormatter } from "helpers/dateFormatter";
import {
  INCORRECT_CACHE_LENGTH,
  INCORRECT_CACHE_FORMAT,
  INVALID_LAST_MODIFIED_DATE
} from "constants/errors";
import {
  ALL_NON_NUMERICS,
  AFTER_EVERY_EIGHTH_NUMBER,
  EMPTY_STRING,
  SPACE_AFTER_FIRST_MATCH
} from "constants/regex";
import { IResourceIdentifier, SeoS3ObjectName } from "types/s3Objects";

export function getCacheId(cacheId?: string): number | null {
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

  return plainDateFormatter(date);
}

export function cacheIdToVersionComparator(
  objectVersion: AWS.S3.ObjectVersion,
  resourcePrefix: IResourceIdentifier
): boolean {
  if (!resourcePrefix.cacheId) return objectVersion.IsLatest;

  if (!isValid(objectVersion.LastModified)) {
    throw INVALID_LAST_MODIFIED_DATE(getSeoS3ObjectName(objectVersion));
  }

  const lastModifiedDate = plainDateFormatter(objectVersion.LastModified);
  return resourcePrefix.cacheId >= lastModifiedDate;
}

export function getSeoS3ObjectName(
  object: AWS.S3.ObjectVersion
): SeoS3ObjectName {
  return {
    key: object.Key,
    etag: object.ETag,
    size: object.Size,
    versionId: object.VersionId,
    lastModified: object.LastModified
  };
}
