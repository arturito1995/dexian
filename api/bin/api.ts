#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { DEFAULT_AWS_REGION } from "../src/constants";

const app = new cdk.App();

new ApiStack(app, "api", {
  isProd: false,
  env: { region: DEFAULT_AWS_REGION },
});
