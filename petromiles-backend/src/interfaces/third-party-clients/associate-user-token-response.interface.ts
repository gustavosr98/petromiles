import { AssociateUserTokenRequest } from '@/interfaces/third-party-clients/associate-user-token-request.interface';

export interface AssociateUserTokenResponse {
  request: AssociateUserTokenRequest;
  userToken: string;
}
