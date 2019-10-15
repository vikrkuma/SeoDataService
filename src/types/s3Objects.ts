export interface IResourceIdentifier {
  resourceId: string;
  cacheId?: number;
  objectId: string;
}

export interface SeoS3ObjectName {
  key: string;
  etag: string;
  size: number;
  lastModified: Date;
  versionId: string;
}
