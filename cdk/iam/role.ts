import * as iam from '@aws-cdk/aws-iam';
import { accountId, lambdaRoleName } from '../constant';

type RoleSetting = {
  id: string;
  props: iam.RoleProps;
};
export const lambdaRoleSetting: RoleSetting = {
  id: lambdaRoleName,
  props: {
    roleName: lambdaRoleName,
    assumedBy: new iam.AccountPrincipal(accountId),
  },
};
