#!/usr/bin/env deno
import * as cdk from "npm:aws-cdk-lib";
import { TailscaleExitnodesCdkStack } from "./stack.ts";

const app = new cdk.App();

const tailscaleAuthKey = Deno.env.get("TAILSCALE_AUTH_KEY")!;

const stackForRegion = function (
  id: string,
  region: string,
  exitNodeName: string
) {
  return new TailscaleExitnodesCdkStack(app, id, {
    tailscaleAuthKey,
    exitNodeName,
    env: {
      region: region,
    },
  });
};

const stacks = [stackForRegion("SPEXITNODE", "sa-east-1", "SPAwsExitNode")];
