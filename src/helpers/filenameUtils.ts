import { DIRECTORY_SEPARATOR, JSONFileExt } from "constants/fileTypes";
import { IResourceIdentifier } from "types/s3Objects";

export function getObjectKeyPrefix(
  resourcePrefix: IResourceIdentifier
): string {
  return (
    resourcePrefix.resourceId +
    DIRECTORY_SEPARATOR +
    resourcePrefix.objectId +
    JSONFileExt
  );
}
