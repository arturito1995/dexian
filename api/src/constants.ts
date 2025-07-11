export const EXTERNAL_MODULES = [
  "joi",
  "@aws-lambda-powertools/metrics",
  "@aws-lambda-powertools/logger",
  "@aws-lambda-powertools/tracer",
  "@aws-sdk/*",
];
export const DEFAULT_AWS_REGION = "sa-east-1";

export const DEFAULT_LAMBDA_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};
