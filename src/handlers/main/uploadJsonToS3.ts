import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { BAD_REQUEST, OK_RESPONSE, ERROR_RESPONSE } from "constants/requests";
import { processUploadData } from "helpers/uploadDataUtils";

import { POST } from "constants/methods";

const uploadCsv: APIGatewayProxyHandler = async (event, _context) => {
  if (event.httpMethod !== POST) return BAD_REQUEST;

  // Logging.
  console.log("***** Request Body *******", event.body, typeof event.body);

  // On Success upload to S3.
  const isSuccess = await processUploadData(event.body);
  return isSuccess.isOk()
    ? OK_RESPONSE(isSuccess.unwrap())
    : ERROR_RESPONSE(isSuccess.unwrap());
};

export default uploadCsv;
