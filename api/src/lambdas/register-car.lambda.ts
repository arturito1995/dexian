import { APIGatewayProxyEventBase, APIGatewayProxyResult } from "aws-lambda";

import { SchemaValidator } from "../helpers/schema-validator";
import { HttpStatusCodes } from "../enums";
import { registerCarSchema } from "../schemas/register-car.schema";
import { DEFAULT_LAMBDA_HEADERS } from "../constants";
import { DynamoHelper } from "../helpers/dynamo-helper";

const schemaValidator = new SchemaValidator();
const dynamoHelper = new DynamoHelper<CarModel>();

class RegisterCarLambda {
  public handler = async (event: APIGatewayProxyEventBase<CarModel>): Promise<APIGatewayProxyResult> => {
    try {
      if (!event.body) throw new Error("Request body is required");

      const payload = JSON.parse(event.body);

      schemaValidator.validateSchema(registerCarSchema, payload);

      const result = await dynamoHelper.create(payload, { tableName: "cars-table" });

      return {
        statusCode: HttpStatusCodes.CREATED,
        headers: DEFAULT_LAMBDA_HEADERS,
        body: JSON.stringify({
          car: result,
          success: true,
        }),
      };
    } catch (error) {
      return {
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        headers: DEFAULT_LAMBDA_HEADERS,
        body: JSON.stringify({ error: error?.toString(), success: false }),
      };
    }
  };
}

const handlerClass = new RegisterCarLambda();
export const handler = handlerClass.handler;
