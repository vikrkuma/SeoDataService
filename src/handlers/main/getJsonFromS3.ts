import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { BAD_REQUEST, BAD_PAYLOAD, OK_RESPONSE } from "constants/requests";
import { getS3Object } from "helpers/s3ListingUtils";

const getJsonFromS3: APIGatewayProxyHandler = async (event, _context) => {
  if (event.httpMethod !== "GET") return BAD_REQUEST;

  // Logging.
  console.log("***** Request Body *******", event.body, typeof event.body);

  // Parse and validate json.
  const jsonData = await getS3Object(event.pathParameters);
  if (!jsonData.isOk()) return BAD_PAYLOAD(jsonData.unwrap());

  return OK_RESPONSE(jsonData.unwrap());
};

export default getJsonFromS3;
