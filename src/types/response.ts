export type AnyData = string | boolean | number;

export interface ISingleJsonData {
  [key: string]: AnyData | AnyData[];
}

export type IJsonData = ISingleJsonData | ISingleJsonData[];

export interface ISeoKey {
  resourceId: string;
  cacheId?: string;
  objectId: string;
}

export type PathParameters = { [name: string]: string } | null;

export interface ISeoData extends ISeoKey {
  data: IJsonData;
}

export interface NodeResponse {
  statusCode: number;
  body: string;
}
