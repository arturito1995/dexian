import { APIGatewayProxyEventBase, APIGatewayProxyResult } from "aws-lambda";
import { SchemaValidator } from "../helpers/schema-validator";
import { HttpStatusCodes } from "../enums";
import { registerCarSchema } from "../schemas/register-car.schema";
import { DEFAULT_LAMBDA_HEADERS } from "../constants";
import { DynamoHelper } from "../helpers/dynamo-helper";

import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { Metrics, MetricUnit } from "@aws-lambda-powertools/metrics";

const namespace = "RegisterCarService";
const serviceName = "RegisterCarLambda";
const logger = new Logger({ serviceName });
const tracer = new Tracer({ serviceName });
const metrics = new Metrics({ namespace, serviceName });

const schemaValidator = new SchemaValidator();
const dynamoHelper = new DynamoHelper<CarModel>();

class RegisterCarLambda {
  constructor() {}

  @logger.injectLambdaContext({ clearState: true })
  @tracer.captureLambdaHandler()
  @metrics.logMetrics({ captureColdStartMetric: true })
  public async handler(event: APIGatewayProxyEventBase<CarModel>, context: any): Promise<APIGatewayProxyResult> {
    try {
      if (!event.body) {
        logger.error("Request body is required!");
        metrics.addMetric("MissingBody", MetricUnit.Count, 1);
        throw new Error("Request body is required");
      }

      const payload = JSON.parse(event.body);
      logger.info("Parsed payload", { payload });

      schemaValidator.validateSchema(registerCarSchema, payload);
      logger.info("Payload validated against schema");

      const result = await dynamoHelper.create(payload, { tableName: "cars-table" });

      metrics.addMetric("CarRegistered", MetricUnit.Count, 1);
      logger.info("Car registered successfully", { car: result });

      return {
        statusCode: HttpStatusCodes.CREATED,
        headers: DEFAULT_LAMBDA_HEADERS,
        body: JSON.stringify({
          car: result,
          success: true,
        }),
      };
    } catch (error) {
      logger.error("Error registering car", { error });
      metrics.addMetric("RegisterCarError", MetricUnit.Count, 1);
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

const handlerClass = new RegisterCarLambda();
export const handler = handlerClass.handler.bind(handlerClass);
