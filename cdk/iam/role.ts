import * as iam from '@aws-cdk/aws-iam';
import { lambdaRoleName } from '../../constants';

type RoleSetting = {
  id: string;
  props: iam.RoleProps;
};
export const lambdaRoleSetting: RoleSetting = {
  id: lambdaRoleName,
  props: {
    roleName: lambdaRoleName,
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  },
};
