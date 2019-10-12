export type AnyData = string | boolean | number;

export interface ISingleJsonData {
  [key: string]: AnyData | AnyData[];
}

export type IJsonData = ISingleJsonData | ISingleJsonData[];

export interface ISeoData {
  key: string;
  data: IJsonData;
}

export interface NodeResponse {
  statusCode: number;
  body: string;
}
