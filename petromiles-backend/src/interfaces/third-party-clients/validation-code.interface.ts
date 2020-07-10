import { ThirdPartyClientsErrorCodes } from '@/enums/third-party-clients-error-codes.enum';

export interface ValidationCode {
  valid: boolean;
  error?: ThirdPartyClientsErrorCodes;
}
