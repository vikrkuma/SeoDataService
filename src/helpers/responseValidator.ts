import { ISeoData } from "types/response";
import { IResourceIdentifier } from "types/s3Objects";
import {
  INVALID_REQUEST_RESOURCE_ID,
  INVALID_REQUEST_OBJECT_ID,
  INVALID_REQUEST_DATA_ID
} from "constants/errors";

/** Validates that all the required fields are present in request payload. */
export function validatePostData(data: ISeoData) {
  validateRequestParameter(data);
  if (!data.data) throw INVALID_REQUEST_DATA_ID;
}

export function validateRequestParameter(data: IResourceIdentifier) {
  if (!data.resourceId) throw INVALID_REQUEST_RESOURCE_ID;

  if (!data.objectId) throw INVALID_REQUEST_OBJECT_ID;
}
