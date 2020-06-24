import { AssociateUserCodeRequest } from '@/interfaces/third-party-clients/associate-user-code-request.interface';

export interface AssociateUserCodeResponse {
  request: AssociateUserCodeRequest;
  responseStatus: string;
}
