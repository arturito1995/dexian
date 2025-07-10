import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as codebuild from "aws-cdk-lib/aws-codebuild";

const APP_NAME = "client";
const DEFAULT_BRANCH_NAME = "main";
const REPOSITORY_NAME = "https://github.com/arturito1995/dexian";
const ACCESS_TOKEN = `{{resolve:secretsmanager:gh-token}}`;
const API_URL = "https://rj8s65yogb.execute-api.sa-east-1.amazonaws.com/prod/";

//test client cdk deploy

export class ClientStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const app = new amplify.CfnApp(this, "client", {
      name: APP_NAME,
      repository: REPOSITORY_NAME,
      accessToken: ACCESS_TOKEN,
      platform: "WEB",
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "1.0",
        frontend: {
          phases: {
            preBuild: {
              commands: ["cd client", "nvm use 20", "npm ci"],
            },
            build: {
              commands: ["npm run build"],
            },
          },
          artifacts: {
            baseDirectory: "client/dist",
            files: ["**/*"],
          },
          cache: {
            paths: ["node_modules/**/*"],
          },
        },
      }).toBuildSpec(),
      environmentVariables: [{ name: "VITE_API_URL", value: API_URL }],
      customRules: [
        {
          source: "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>",
          target: "/index.html",
          status: "200",
        },
      ],
    });

    new amplify.CfnBranch(this, `${APP_NAME}-branch-main`, {
      appId: app.attrAppId,
      branchName: DEFAULT_BRANCH_NAME,
      stage: "PRODUCTION",
      framework: "WEB",
      enableAutoBuild: true,
    });
  }
}
