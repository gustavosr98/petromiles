import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Inject } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {ApiModules} from "@/logger/api-modules.enum";



export interface Response<T> {
    data: T;
}

@Injectable()
export class AuditBankAccountInterceptor<T> implements NestInterceptor<T, Response<T>>{
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<Response<T>>> {
        const req = context.switchToHttp().getRequest();

        const body = JSON.stringify(req.body)

        this.logger.info(`Change made to [${ApiModules.BANK_ACCOUNT}] module by email: [${req.user.email}] with role: [${req.user.role}]`)
        this.logger.info(`Changes: [${body}]`)

        return next.handle().pipe();
    }
}