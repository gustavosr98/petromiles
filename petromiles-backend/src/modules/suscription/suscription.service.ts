import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { getConnection, getRepository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Suscription as SuscriptionType } from './suscription/suscription.enum';

import { UserClient } from '../user/user-client/user-client.entity';
import { Transaction } from '../transaction/transaction/transaction.entity';
import { Suscription } from './suscription/suscription.entity';
import { UserSuscription } from '../user-suscription/user-suscription.entity';
import { UserClientService } from '../user/user-client/user-client.service';
import { ClientBankAccountService } from '../bank-account/client-bank-account/client-bank-account.service';
import { TransactionService } from '../transaction/transaction.service';
import { ApiModules } from 'src/logger/api-modules.enum';

@Injectable()
export class SuscriptionService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private userClientService: UserClientService,
    private clientBankAccount: ClientBankAccountService,
    private transactionService: TransactionService,
  ) {}
  async getSuscription(suscriptionType: SuscriptionType): Promise<Suscription> {
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
    const suscription = await this.getSuscription(suscriptionType);

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

  async upgradeToPremiumSuscription(
    email: string,
    idBankAccount: number,
  ): Promise<UserSuscription> {
    const userClient = await this.userClientService.getClient(email);
    const suscription = await this.getSuscription(SuscriptionType.PREMIUM);

    const clientBankAccount = await this.clientBankAccount.getClientBankAccount(
      userClient,
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
}
