import { ISeoData } from "types/response";
import { IResourceIdentifier } from "types/s3Objects";
import {
  INVALID_REQUEST_RESOURCE_ID,
  INVALID_REQUEST_OBJECT_ID,
  INVALID_REQUEST_DATA_ID
} from "constants/errors";

/** Validates that all the required fields are present in request payload. */
export function validateJsonData(
  data: ISeoData | IResourceIdentifier,
  noValidateData = false
) {
  if (!data.resourceId) throw INVALID_REQUEST_RESOURCE_ID;

  if (!data.objectId) throw INVALID_REQUEST_OBJECT_ID;

  if (!noValidateData && !(data as ISeoData).data) {
    throw INVALID_REQUEST_DATA_ID;
  }
}
