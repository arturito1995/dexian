import { APIGatewayProxyEventBase, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCodes } from "../enums";
import { DEFAULT_LAMBDA_HEADERS } from "../constants";
import { DynamoHelper } from "../helpers/dynamo-helper";

const dynamoHelper = new DynamoHelper<CarModel>({ tableName: "cars-table" });

class DeleteCarLambda {
  public handler = async (event: APIGatewayProxyEventBase<any>): Promise<APIGatewayProxyResult> => {
    try {
      const carId = event.pathParameters?.id;

      if (!carId) throw new Error("Car ID is required");

      const existingCar = await dynamoHelper.queryOne({ value: carId });

      if (!existingCar) throw new Error("Car not found");

      await dynamoHelper.delete({ id: carId });

      return {
        statusCode: HttpStatusCodes.NO_CONTENT,
        headers: DEFAULT_LAMBDA_HEADERS,
        body: JSON.stringify({ success: true }),
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

const handlerClass = new DeleteCarLambda();
export const handler = handlerClass.handler;
