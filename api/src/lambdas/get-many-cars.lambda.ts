import { APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCodes } from "../enums";
import { DEFAULT_LAMBDA_HEADERS } from "../constants";
import { DynamoHelper } from "../helpers/dynamo-helper";

const dynamoHelper = new DynamoHelper<CarModel>({ tableName: "cars-table" });

class GetManyCarsLambda {
  public handler = async (): Promise<APIGatewayProxyResult> => {
    try {
      const result = await dynamoHelper.queryMany({});

      return {
        statusCode: HttpStatusCodes.OK,
        headers: DEFAULT_LAMBDA_HEADERS,
        body: JSON.stringify({
          cars: result,
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

const handlerClass = new GetManyCarsLambda();
export const handler = handlerClass.handler;
