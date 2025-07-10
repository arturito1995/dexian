import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import * as logs from "aws-cdk-lib/aws-logs";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

import { DEFAULT_AWS_REGION, EXTERNAL_MODULES } from "../../src/constants";

export class LambdasModule extends Construct {
  private readonly layerLambda: lambda.ILayerVersion;
  private readonly lambdaOptions: NodejsFunctionProps;

  public readonly registerCar: NodejsFunction;
  public readonly getManyCars: NodejsFunction;
  public readonly getOneCar: NodejsFunction;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id);

    this.layerLambda = new lambda.LayerVersion(this, "layer-lambda", {
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "layer")),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      description: "Layer for external dependencies",
    });

    this.lambdaOptions = {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.X86_64,
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      logRetention: logs.RetentionDays.ONE_MONTH,
      layers: [this.layerLambda],
      retryAttempts: 2,
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: EXTERNAL_MODULES,
      },
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
        AwsRegion: props.env?.region ?? DEFAULT_AWS_REGION,
      },
    };

    this.registerCar = this.createFunction(this, "register-car");
    this.getManyCars = this.createFunction(this, "get-many-cars");
    this.getOneCar = this.createFunction(this, "get-one-car");
  }

  public createFunction(scope: Construct, name: string, options?: NodejsFunctionProps): NodejsFunction {
    return new NodejsFunction(scope, name, {
      ...this.lambdaOptions,
      ...options,
      functionName: `${name}-lambda`,
      entry: `./src/lambdas/${name}.lambda.ts`,
      logRetention: logs.RetentionDays.ONE_MONTH,
    });
  }
}
