import { APIGatewayProxyEventBase, APIGatewayProxyResult } from "aws-lambda";

import { HttpStatusCodes } from "../enums";
import { DEFAULT_LAMBDA_HEADERS } from "../constants";
import { DynamoHelper } from "../helpers/dynamo-helper";

const dynamoHelper = new DynamoHelper<CarModel>();

class GetOneCarLambda {
  public handler = async (event: APIGatewayProxyEventBase<CarModel>): Promise<APIGatewayProxyResult> => {
    try {
      const carId = event.pathParameters?.id;

      if (!carId) throw new Error("Id is required");

      const result = await dynamoHelper.queryOne({ value: carId }, { tableName: "cars-table" });

      if (!result) throw new Error("Not found");

      return {
        statusCode: HttpStatusCodes.OK,
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

const handlerClass = new GetOneCarLambda();
export const handler = handlerClass.handler;
