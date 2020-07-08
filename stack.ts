import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../.env') });

import { env, stackName, stackEnvProps } from './constants';
import { lambdaRoleSetting } from './cdk/iam/role';
import { lambdaPolicySetting } from './cdk/iam/policy';

export class TsCdkLambdaStack extends cdk.Stack {
  readonly lambdaRole: iam.Role;
  readonly lambdaPolicy: iam.ManagedPolicy;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.lambdaRole = this.newLambdaRole();
    this.lambdaPolicy = this.newLambdaPolicy();

    const sampleLambda = new lambda.Function(this, 'sampleLambda', {
      functionName: 'ts-cdk-sample',
      handler: 'index.sample',
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset('dist/src/api'),
      timeout: cdk.Duration.seconds(60),
      environment: {
        ENV: env,
      },
      role: this.lambdaRole,
    });

    const sampleTable = new dynamodb.Table(this, 'sampleTable', {
      tableName: 'ts-cdk-sample',
      billingMode: dynamodb.BillingMode.PROVISIONED,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });
    sampleTable.grantReadWriteData(sampleLambda);

    const sampleApi = new apigateway.LambdaRestApi(this, 'sampleApi', {
      restApiName: 'itemApi',
      handler: sampleLambda,
      proxy: false,
      deployOptions: {
        stageName: env,
      },
    });

    const items = sampleApi.root.addResource('items');
    items.addMethod('GET');

    const item = items.addResource('{item}');
    item.addMethod('GET');
    item.addMethod('POST');
    item.addMethod('DELETE');
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
