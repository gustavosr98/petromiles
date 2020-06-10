import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import {getConnection, getManager, getRepository, Repository} from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {InjectRepository} from "@nestjs/typeorm";

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

  async getActualSubscription(email: string): Promise<Suscription> {
    const userId = await this.userClientRepository.findOne( {email} )
    const actualSubscription = await this.suscriptionRepository
        .createQueryBuilder('subscription')
        .innerJoin('subscription.userSuscription', 'us')
        .where(`us.fk_user_client = :id`, { id: userId.idUserClient })
        .andWhere('us."finalDate" is null')
        .getOne();
    return actualSubscription;
  }
}
