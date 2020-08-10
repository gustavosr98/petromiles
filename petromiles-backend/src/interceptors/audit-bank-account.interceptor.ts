import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {ApiModules} from "@/logger/api-modules.enum";
import {StateBankAccount} from "@/entities/state-bank-account.entity";
import {State} from "@/entities/state.entity";
import {Repository} from "typeorm";


export interface Response<T> {
    data: T;
}

@Injectable()
export class AuditBankAccountInterceptor<T> implements NestInterceptor<T, Response<T>>{
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(StateBankAccount)
        private stateBankAccountRepository: Repository<StateBankAccount>,
        @InjectRepository(State)
        private stateRepository: Repository<State>,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<Response<T>>> {
        const req = context.switchToHttp().getRequest();


        const stateBa = await this.stateRepository
            .createQueryBuilder('s')
            .innerJoin('s.stateBankAccount','sba')
            .innerJoin('sba.clientBankAccount','cba')
            .where('cba.fk_user_client = :id',{id: req.body.idUserClient})
            .andWhere('sba."finalDate" IS NULL')
            .andWhere('cba.fk_bank_account = :idBA',{idBA: req.body.idBankAccount})
            .getOne()

        const newData = req.body

        this.logger.verbose(`[@Audit] Change made to ${ApiModules.BANK_ACCOUNT} module by email: [${req.user.email}] with role: [${req.user.role}] \n
         Previous data: [idUserClient: ${req.body.idUserClient}, idBankAccount: ${req.body.idBankAccount}, state: ${stateBa.name}]\n
         Changes: %o`,{newData})


        return next.handle().pipe();
    }
}