import {
  Controller,
  Post,
  Inject,
  Body,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { ApiKeyInterceptor } from '@/interceptors/apikey-validator.interceptor';
import { CurrencyInterceptor } from '@/interceptors/currency-validator.interceptor';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

// SERVICES
import { ThirdPartyClientsService } from '@/modules/third-party-clients/services/third-party-clients.service';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';
import { Role } from '@/enums/role.enum';
import { AddPointsResponse } from '@/interfaces/third-party-clients/add-points-response.interface';
import { AssociateUserCodeResponse } from '@/interfaces/third-party-clients/associate-user-code-response.interface';
import { AssociateUserTokenResponse } from '@/interfaces/third-party-clients/associate-user-token-response.interface';
import { CsvCheckResponse } from '@/interfaces/third-party-clients/csv-check-response.interface';
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';
import { AssociateUserCodeRequest } from '@/modules/third-party-clients/dto/associate-user-code-request.dto';
import { AssociateUserTokenRequest } from '@/modules/third-party-clients/dto/associate-user-token-request.dto';
import { AddPointsRequest } from '@/modules/third-party-clients/dto/add-points-request.dto';
import { CsvCheckRequest } from '@/modules/third-party-clients/dto/csv-check-request.dto';

const baseEndpoint = 'third-party-clients';
@Controller(baseEndpoint)
@UseInterceptors(ApiKeyInterceptor)
export class ThirdPartyClientsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly thirdPartyClientsService: ThirdPartyClientsService,
  ) {}

  @Post('associate-user-code')
  async associateUserCode(
    @Body() associateUserCodeRequest: AssociateUserCodeRequest,
  ): Promise<AssociateUserCodeResponse> {
    this.logger.http(
      `[${ApiModules.THIRD_PARTY_CLIENTS}] (${HttpRequest.POST})   { apiKey: ${associateUserCodeRequest.apiKey} }  asks /${baseEndpoint}/associate-user-code`,
    );

    return await this.thirdPartyClientsService.associateUserCode(
      associateUserCodeRequest,
    );
  }

  @Post('associate-user-token')
  async associateUserToken(
    @Body() associateUserTokenRequest: AssociateUserTokenRequest,
  ): Promise<AssociateUserTokenResponse> {
    this.logger.http(
      `[${ApiModules.THIRD_PARTY_CLIENTS}] (${HttpRequest.POST})   { apiKey: ${associateUserTokenRequest.apiKey} }  asks /${baseEndpoint}/associate-user-token`,
    );

    return await this.thirdPartyClientsService.associateUserToken(
      associateUserTokenRequest,
    );
  }

  @Post('csv-check')
  @UseInterceptors(FileInterceptor('file'), ApiKeyInterceptor)
  async csvCheck(
    @Body() csvCheckRequest: CsvCheckRequest,
    @UploadedFile('file') csvFile,
  ): Promise<CsvCheckResponse> {
    this.logger.http(
      `[${ApiModules.THIRD_PARTY_CLIENTS}] { apiKey: ${csvCheckRequest.apiKey} } ${baseEndpoint}/csv-check`,
    );
    const csvCheckResponse: CsvCheckResponse = {
      request: csvCheckRequest,
      confirmationTickets: await this.thirdPartyClientsService.csvCheck(
        csvCheckRequest.apiKey,
        csvFile,
      ),
    };
    return csvCheckResponse;
  }

  @Roles(Role.THIRD_PARTY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(CurrencyInterceptor)
  @Post('add-points')
  async addPoints(
    @Body() addPointsRequest: AddPointsRequest,
    @GetUser() user: AuthenticatedUser,
  ): Promise<AddPointsResponse> {
    let { apiKey, type } = addPointsRequest;
    this.logger.http(
      `[${ApiModules.THIRD_PARTY_CLIENTS}] [addPoints-${type}] (${
        HttpRequest.POST
      })  {apiKey: ${apiKey.substr(0, 2)}..${apiKey.substr(-4)}}  {${
        user.email
      }} asks /${baseEndpoint}/add-points`,
    );
    return await this.thirdPartyClientsService.addPoints(
      addPointsRequest,
      user,
    );
  }
}
