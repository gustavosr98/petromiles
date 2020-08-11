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
import {UserDetails} from "@/entities/user-details.entity";
import {Repository} from "typeorm";
import { transform, isEqual, isObject} from 'lodash';


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

        const previousData = await this.userDetailsRepository.find({where: [{idUserDetails: req.body.idUserDetails}]})
        const newData = await this.differenceBetween(previousData, req.body);
        this.logger.verbose(`[@Audit] Change made to ${ApiModules.USER} module by email: [${req.user.email}] with role: [${req.user.role}] \n 
        Changes: %o`,{previousData ,newData})

        return next.handle().pipe();
    }

    private differenceBetween(baseObject, newObject) {
        return this.changes(baseObject, newObject);
    }
    private changes(baseObject, newObject) {
        return transform(newObject, (result, value, key) => {
            if (!isEqual(value, baseObject[key])) {
                result[key] =
                    isObject(value) && isObject(baseObject[key])
                        ? this.changes(value, baseObject[key])
                        : value;
            }
        });
    }

}