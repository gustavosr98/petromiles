import { AssociateUserCodeRequest } from '@/modules/third-party-clients/dto/associate-user-code-request.dto';

export interface AssociateUserCodeResponse {
  request: AssociateUserCodeRequest;
  responseStatus: string;
}
