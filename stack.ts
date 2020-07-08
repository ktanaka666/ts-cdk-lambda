import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../.env') });

import { stackName, stackEnvProps } from './cdk/constant';
import { lambdaRoleSetting } from './cdk/iam/role';
import { lambdaPolicySetting } from './cdk/iam/policy';

export class TsCdkLambdaStack extends cdk.Stack {
  readonly lambdaRole: iam.Role;
  readonly lambdaPolicy: iam.ManagedPolicy;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.lambdaRole = this.newLambdaRole();
    this.lambdaPolicy = this.newLambdaPolicy();
  }

  private newLambdaRole() {
    return new iam.Role(this, lambdaRoleSetting.id, lambdaRoleSetting.props);
  }
  private newLambdaPolicy() {
    const policy = new iam.ManagedPolicy(
      this,
      lambdaPolicySetting.id,
      lambdaPolicySetting.props,
    );
    policy.attachToRole(this.lambdaRole);
    return policy;
  }
}

const app = new cdk.App();
new TsCdkLambdaStack(app, stackName, stackEnvProps);
app.synth();
