import { Controller, Post, Inject, Body } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';

import { AddPointsRequest } from '@/modules/third-party-clients/dto/add-points-request.dto';
import { AddPointsResponse } from '@/interfaces/third-party-clients/add-points-response.interface';
import { AssociateUserCodeRequest } from '@/interfaces/third-party-clients/associate-user-code-request.interface';
import { AssociateUserCodeResponse } from '@/interfaces/third-party-clients/associate-user-code-response.interface';
import { AssociateUserTokenRequest } from '@/interfaces/third-party-clients/associate-user-token-request.interface';
import { AssociateUserTokenResponse } from '@/interfaces/third-party-clients/associate-user-token-response.interface';
import { CsvCheckRequest } from '@/interfaces/third-party-clients/csv-check-request.interface';
import { CsvCheckResponse } from '@/interfaces/third-party-clients/csv-check-response.interface';

// SERVICES
import { ThirdPartyClientsService } from '@/modules/third-party-clients/services/third-party-clients.service';

const baseEndpoint = 'third-party-clients';
@Controller(baseEndpoint)
export class ThirdPartyClientsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private thirdPartyClientsService: ThirdPartyClientsService,
  ) {}

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
  async addPoints(
    @Body() addPointsRequest: AddPointsRequest,
  ): Promise<AddPointsResponse> {
    this.logger.http(
      `[${ApiModules.THIRD_PARTY_CLIENTS}] (${HttpRequest.POST}) ${addPointsRequest.apiKey} asks /${baseEndpoint}/add-points`,
    );
    return await this.thirdPartyClientsService.addPoints(addPointsRequest);
  }

  @Post('csv-check')
  csvCheck(csvCheckRequest: CsvCheckRequest): CsvCheckResponse {
    return null;
  }
}
