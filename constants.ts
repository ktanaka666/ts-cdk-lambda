import { StackProps } from '@aws-cdk/core';

export const env = process.env.ENV || 'dev';

export const accountId = process.env.AWS_ACCOUNT_ID || '';
export const stackName =
  process.env.AWS_CLOUDFORMATION_STACK_NAME || 'TsCdkLambdaExample';
export const stackEnvProps: StackProps = {
  env: {
    region: process.env.AWS_REGION || 'ap-northeast-1',
    account: accountId,
  },
};

// Resource name or id
export const lambdaRoleName = 'TsCdkLambdaRole';
export const lambdaManagedPolicyName = 'TsCdkLambdaPolicy';
