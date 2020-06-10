import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import {getConnection, getManager, getRepository, Repository} from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// INTERFACES
import { Suscription as SuscriptionType } from '@/enums/suscription.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { UpdateSubscriptionDTO } from '@/modules/suscription/dto/update-subscription.dto';

// ENTITIES
import { UserClient } from '@/entities/user-client.entity';
import { Transaction } from '@/entities/transaction.entity';
import { Suscription } from '@/entities/suscription.entity';
import { UserSuscription } from '@/entities/user-suscription.entity';

// SERVICES
import { UserClientService } from '@/modules/user/services/user-client.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { UserClient } from '../user/user-client/user-client.entity';
import { Transaction } from '../transaction/transaction/transaction.entity';
import { Suscription } from './suscription/suscription.entity';
import { UserSuscription } from '../user-suscription/user-suscription.entity';
import { UserClientService } from '../user/user-client/user-client.service';
import { TransactionService } from '../transaction/transaction.service';
import { BankAccountService } from '../bank-account/bank-account.service';
import { ApiModules } from 'src/logger/api-modules.enum';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class SuscriptionService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    @InjectRepository(Suscription)
    private suscriptionRepository: Repository<Suscription>,
    private userClientService: UserClientService,
    private clientBankAccountService: ClientBankAccountService,
    private transactionService: TransactionService,
  ) {}
  async get(suscriptionType: SuscriptionType): Promise<Suscription> {
    return await getConnection()
      .getRepository(Suscription)
      .findOne({ name: suscriptionType });
  }

  async createUserSuscription(
    userClient: UserClient,
    suscriptionType: SuscriptionType,
    transaction: Transaction,
  ) {
    if (suscriptionType !== SuscriptionType.BASIC) {
      await this.changeCurrentUserSuscription(userClient);
    }
    const suscription = await this.get(suscriptionType);

    const userSuscription = await getConnection()
      .getRepository(UserSuscription)
      .create({
        userClient,
        suscription,
        transaction,
        upgradedAmount: suscription.cost,
      })
      .save();

    this.logger.silly(
      `[${ApiModules.SUSCRIPTION}]  The user ${userClient.email} has the ${suscriptionType} subscription`,
    );

    return userSuscription;
  }

  // Convert the current subscription to  an old suscription by setting to the finalDate the actual date
  private async changeCurrentUserSuscription(userClient: UserClient) {
    const userSuscriptionRepository = await getRepository(UserSuscription);
    const currentSuscription = await userSuscriptionRepository.findOne({
      userClient,
      finalDate: null,
    });
    currentSuscription.finalDate = new Date();
    await userSuscriptionRepository.save(currentSuscription);
  }

  async upgradeToPremium(
    email: string,
    idBankAccount: number,
  ): Promise<UserSuscription> {
    const userClient = await this.userClientService.get(email);
    const suscription = await this.get(SuscriptionType.PREMIUM);

    const clientBankAccount = await this.clientBankAccountService.getOne(
      userClient.idUserClient,
      idBankAccount,
    );

    const transaction = await this.transactionService.createUpgradeSuscriptionTransaction(
      clientBankAccount,
      suscription,
    );

    return await this.createUserSuscription(
      userClient,
      SuscriptionType.PREMIUM,
      transaction,
    );
  }

  async getActualSuscription(email: string): Promise<Suscription> {
    const userId = await this.userClientRepository.findOne( {email} )
    const actualSuscription = await getManager()
        .createQueryBuilder()
        .select('suscription.name')
        .from(Suscription, 'suscription')
        .innerJoin(UserSuscription,
            'user_suscription',
            'suscription."idSuscription"= user_suscription.fk_suscription')
        .where(`user_suscription.fk_user_client= '${userId.idUserClient}'`)
        .getOne();
    return actualSuscription;
  }
}
