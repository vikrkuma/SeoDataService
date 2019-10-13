import { IResourceIdentifier } from "types/s3Objects";
export type AnyData = string | boolean | number;

export interface ISingleJsonData {
  [key: string]: AnyData | AnyData[];
}

export type IJsonData = ISingleJsonData | ISingleJsonData[];

export type PathParameters = { [name: string]: string } | null;

export interface ISeoData extends IResourceIdentifier {
  data: IJsonData;
}

export interface NodeResponse {
  statusCode: number;
  body: string;
}
