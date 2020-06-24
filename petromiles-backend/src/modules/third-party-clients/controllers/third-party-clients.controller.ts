import { Controller, Post } from '@nestjs/common';

// INTERFACES
import { AddPointsRequest } from '@/interfaces/third-party-clients/add-points-request.interface';
import { AddPointsResponse } from '@/interfaces/third-party-clients/add-points-response.interface';
import { AssociateUserCodeRequest } from '@/interfaces/third-party-clients/associate-user-code-request.interface';
import { AssociateUserCodeResponse } from '@/interfaces/third-party-clients/associate-user-code-response.interface';
import { AssociateUserTokenRequest } from '@/interfaces/third-party-clients/associate-user-token-request.interface';
import { AssociateUserTokenResponse } from '@/interfaces/third-party-clients/associate-user-token-response.interface';
import { CsvCheckRequest } from '@/interfaces/third-party-clients/csv-check-request.interface';
import { CsvCheckResponse } from '@/interfaces/third-party-clients/csv-check-response.interface';

const baseEndpoint = 'third-party-clients';
@Controller(baseEndpoint)
export class ThirdPartyClientsController {
  @Post('associate-user-code')
  associateUserCode(
    associateUserCodeRequest: AssociateUserCodeRequest,
  ): AssociateUserCodeResponse {
    return null;
  }

  @Post('associate-user-token')
  associateUserToken(
    associateUserTokenRequest: AssociateUserTokenRequest,
  ): AssociateUserTokenResponse {
    return null;
  }

  @Post('add-points')
  addPoints(addPointsRequest: AddPointsRequest): AddPointsResponse {
    return null;
  }

  @Post('csv-check')
  csvCheck(csvCheckRequest: CsvCheckRequest): CsvCheckResponse {
    return null;
  }
}
