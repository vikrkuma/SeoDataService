import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import {
  BAD_REQUEST,
  BAD_PAYLOAD,
  OK_POST_RESPONSE,
  ERROR_POST_RESPONSE
} from "constants/requests";
import { extractJsonFromCsv } from "helpers/jsonUtils";
import { uploadJsonToS3 } from "helpers/s3Utils";

const uploadCsv: APIGatewayProxyHandler = async (event, _context) => {
  if (event.httpMethod !== "POST") return BAD_REQUEST;

  // Logging.
  console.log("***** Request Body *******", event.body, typeof event.body);

  // Parse and validate json.
  const jsonData = await extractJsonFromCsv(event.body);
  if (!jsonData.isOk()) return BAD_PAYLOAD(jsonData.unwrap());

  // On Success upload to S3.
  const isSuccess = await uploadJsonToS3(jsonData.unwrap());
  return isSuccess.isOk()
    ? OK_POST_RESPONSE(isSuccess.unwrap())
    : ERROR_POST_RESPONSE(isSuccess.unwrap());
};

export default uploadCsv;
