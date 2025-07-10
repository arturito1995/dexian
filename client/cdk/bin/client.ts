#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ClientStack } from "../lib/client-stack";

const app = new cdk.App();
new ClientStack(app, "client", { env: { region: "sa-east-1" } });
