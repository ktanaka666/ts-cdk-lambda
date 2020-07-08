import * as iam from '@aws-cdk/aws-iam';
import { lambdaManagedPolicyName } from '../../constants';

const policyStatements: iam.PolicyStatement[] = [
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [
      'logs:CreateLogGroup',
      'logs:CreateLogStream',
      'logs:PutLogEvents',
    ],
    resources: ['*'],
  }),
];

type PolicySetting = {
  id: string;
  props: iam.ManagedPolicyProps;
};
export const lambdaPolicySetting: PolicySetting = {
  id: lambdaManagedPolicyName,
  props: {
    managedPolicyName: lambdaManagedPolicyName,
    statements: policyStatements,
  },
};
