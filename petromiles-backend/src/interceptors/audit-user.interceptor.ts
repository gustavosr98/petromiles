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
import {UserDetails} from "@/entities/user-details.entity";
import {Repository} from "typeorm";
import {stringify} from "querystring";
import {audit} from "rxjs/operators";
import * as winston from "winston";


export interface Response<T> {
    data: T;
}

@Injectable()
export class AuditUserInterceptor<T> implements NestInterceptor<T, Response<T>>{
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(UserDetails)
        private userDetailsRepository: Repository<UserDetails>,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<Response<T>>> {
        const req = context.switchToHttp().getRequest();

        const body = JSON.stringify(req.body)
        const userData = await this.userDetailsRepository.find({where: [{idUserDetails: req.body.idUserDetails}]})

        this.logger.verbose(`[@Audit] Change made to ${ApiModules.USER} module by email: [${req.user.email}] with role: [${req.user.role}]`)
        this.logger.verbose(`[@Audit] Previous data: ${JSON.stringify(userData)}`)
        this.logger.verbose(`[@Audit] Changes: ${body}`)


        return next.handle().pipe();
    }
}