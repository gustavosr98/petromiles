import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Inject } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { ThirdPartyClient } from '@/entities/third-party-client.entity';

import { ApiModules } from '@/logger/api-modules.enum';
import { ThirdPartyClientsErrorCodes } from '@/enums/third-party-clients-error-codes.enum';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ApiKeyInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    @InjectRepository(ThirdPartyClient)
    private thirdPartyClientRepository: Repository<ThirdPartyClient>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const req = context.switchToHttp().getRequest();

    if (req.body.apiKey) {
      const thirdPartyClientFound = await this.thirdPartyClientRepository.findOne(
        { apiKey: req.body.apiKey },
      );

      if (!thirdPartyClientFound) {
        this.logger.error(`[${ApiModules.THIRD_PARTY_CLIENTS}] Invalid apiKey`);
        throw new BadRequestException(
          ThirdPartyClientsErrorCodes.UNKNOWN_API_KEY,
        );
      }
    }

    return next.handle().pipe();
  }
}
