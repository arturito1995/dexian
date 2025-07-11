import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { LambdasModule } from "./constructs/lambdas.module";

interface ApiStackProps extends cdk.StackProps {
  isProd: boolean;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const carsTable = new dynamodb.Table(this, "table", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "cars-table",
      removalPolicy: props.isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    const lambdas = new LambdasModule(this, "lambdas", props);

    carsTable.grantReadData(lambdas.getManyCars);
    carsTable.grantReadData(lambdas.getOneCar);
    carsTable.grantReadWriteData(lambdas.registerCar);
    carsTable.grantReadWriteData(lambdas.deleteCar);

    const api = new apigateway.RestApi(this, "rest-api", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });
    const carsResource = api.root.addResource("cars");
    const idResource = carsResource.addResource("{id}");

    carsResource.addMethod("GET", new apigateway.LambdaIntegration(lambdas.getManyCars));
    carsResource.addMethod("POST", new apigateway.LambdaIntegration(lambdas.registerCar));
    idResource.addMethod("GET", new apigateway.LambdaIntegration(lambdas.getOneCar));
    idResource.addMethod("DELETE", new apigateway.LambdaIntegration(lambdas.deleteCar));
  }
}
