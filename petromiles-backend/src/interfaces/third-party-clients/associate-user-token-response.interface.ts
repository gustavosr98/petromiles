import { AssociateUserTokenRequest } from '@/modules/third-party-clients/dto/associate-user-token-request.dto';

export interface AssociateUserTokenResponse {
  request: AssociateUserTokenRequest;
  userToken: string;
}
