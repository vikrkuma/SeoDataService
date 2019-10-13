import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import {
  BAD_REQUEST,
  BAD_PAYLOAD,
  OK_RESPONSE,
  ERROR_RESPONSE
} from "constants/requests";
import { getS3Object } from "helpers/s3ListingUtils";
import { getS3ObjectContent } from "helpers/s3ObjectGetUtils";
import { GET } from "constants/methods";

const getJsonFromS3: APIGatewayProxyHandler = async (event, _context) => {
  if (event.httpMethod !== GET) return BAD_REQUEST;

  // Logging.
  console.log("***** Request Parameters *******", event.pathParameters);

  // Parse and validate get request and depending on that return the required object key.
  const seoFileObject = await getS3Object(event.pathParameters);
  if (!seoFileObject.isOk()) return BAD_PAYLOAD(seoFileObject.unwrap());

  // Read the object key and send the content as response.
  const response = await getS3ObjectContent(seoFileObject.unwrap());
  if (!response.isOk()) return ERROR_RESPONSE(response.unwrap());

  return OK_RESPONSE(response.unwrap());
};

export default getJsonFromS3;
