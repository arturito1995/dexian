import { APIGatewayProxyEventBase, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCodes } from "../enums";
import { DEFAULT_LAMBDA_HEADERS } from "../constants";
import { DynamoHelper } from "../helpers/dynamo-helper";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { Metrics, MetricUnit } from "@aws-lambda-powertools/metrics";

const namespace = "DeleteCarService";
const serviceName = "DeleteCarLambda";
const logger = new Logger({ serviceName });
const tracer = new Tracer({ serviceName });
const metrics = new Metrics({ namespace, serviceName });

const dynamoHelper = new DynamoHelper<CarModel>({ tableName: "cars-table" });

class DeleteCarLambda {
  @logger.injectLambdaContext({ clearState: true })
  @tracer.captureLambdaHandler()
  @metrics.logMetrics({ captureColdStartMetric: true })
  public async handler(event: APIGatewayProxyEventBase<CarModel>, context: any): Promise<APIGatewayProxyResult> {
    try {
      const carId = event.pathParameters?.id;

      logger.info("Received delete request", { carId });

      if (!carId) {
        logger.error("Car ID is missing in path parameters");
        metrics.addMetric("MissingCarId", MetricUnit.Count, 1);
        throw new Error("Car ID is required");
      }

      tracer.putAnnotation("carId", carId);
      const existingCar = await dynamoHelper.queryOne({ value: carId });

      if (!existingCar) {
        logger.warn("Car not found", { carId });
        metrics.addMetric("CarNotFound", MetricUnit.Count, 1);
        throw new Error("Car not found");
      }

      await dynamoHelper.delete({ id: carId });
      logger.info("Car deleted successfully", { carId });
      metrics.addMetric("CarDeleted", MetricUnit.Count, 1);

      return {
        statusCode: HttpStatusCodes.NO_CONTENT,
        headers: DEFAULT_LAMBDA_HEADERS,
        body: JSON.stringify({ success: true }),
      };
    } catch (error) {
      logger.error("Error deleting car", { error: error?.toString() });
      metrics.addMetric("DeleteCarError", MetricUnit.Count, 1);
      return {
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        headers: DEFAULT_LAMBDA_HEADERS,
        body: JSON.stringify({ error: error?.toString(), success: false }),
      };
    } finally {
      metrics.publishStoredMetrics();
    }
  }
}

const handlerClass = new DeleteCarLambda();
export const handler = handlerClass.handler;
