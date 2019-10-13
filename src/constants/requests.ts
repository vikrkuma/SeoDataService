import { NodeResponse } from "types/response";

export const BAD_REQUEST: NodeResponse = {
  statusCode: 403,
  body: "Bad Request"
};

export function BAD_PAYLOAD(message = "Bad Payload"): NodeResponse {
  return {
    statusCode: 422,
    body: message
  };
}

export function OK_RESPONSE(message: string): NodeResponse {
  return {
    statusCode: 200,
    body: message
  };
}

export function ERROR_RESPONSE(message: string): NodeResponse {
  return {
    statusCode: 500,
    body: message
  };
}
