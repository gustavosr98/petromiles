import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getConnection, getManager, getRepository, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';

// CONSTANTS
import { mailsSubjets } from '@/constants/mailsSubjectConst';

// INTERFACES
import { Suscription as SuscriptionType } from '@/enums/suscription.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { StateName } from '@/enums/state.enum';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { TransactionType } from '@/enums/transaction.enum';

// ENTITIES
import { UserClient } from '@/entities/user-client.entity';
import { Transaction } from '@/entities/transaction.entity';
import { Suscription } from '@/entities/suscription.entity';
import { UserSuscription } from '@/entities/user-suscription.entity';

// SERVICES
import { UserClientService } from '@/modules/user/services/user-client.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { MailsService } from '@/modules/mails/mails.service';

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
    private pointsConversionService: PointsConversionService,
    private platformInterestService: PlatformInterestService,
    private mailsService: MailsService,
    private configService: ConfigService,
  ) {}
  async get(suscriptionType: SuscriptionType): Promise<Suscription> {
    return await getConnection()
      .getRepository(Suscription)
      .findOne({ name: suscriptionType });
  }

  async getUserSuscription(userClient: UserClient): Promise<UserSuscription> {
    return await getConnection()
      .getRepository(UserSuscription)
      .findOne({ userClient, finalDate: null });
  }

  async createUserSuscription(
    userClient: UserClient,
    suscriptionType: SuscriptionType,
    transaction?: Transaction,
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
    const userClient = await this.userClientService.get({ email });
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

  async isAbleToUpgradeToGold(userClient: UserClient): Promise<boolean> {
    const currentUserSuscription = await this.getUserSuscription(userClient);

    if (currentUserSuscription.suscription.name === SuscriptionType.PREMIUM) {
      const goldSuscription = await this.get(SuscriptionType.GOLD);

      const interests = await getConnection()
        .getRepository(Transaction)
        .createQueryBuilder('transaction')
        .select(
          'SUM(transaction.totalAmountWithInterest - thirdPartyInterest.amountDollarCents)',
          'totalInterests',
        )
        .innerJoin('transaction.transactionInterest', 'transactionInterest')
        .innerJoin(
          'transactionInterest.thirdPartyInterest',
          'thirdPartyInterest',
        )
        .innerJoin('transaction.clientBankAccount', 'clientBankAccount')
        .innerJoin('clientBankAccount.userClient', 'userClient')
        .innerJoin('transaction.stateTransaction', 'stateTransaction')
        .innerJoin('stateTransaction.state', 'state')
        .where(`userClient.idUserClient = ${userClient.idUserClient}`)
        .andWhere(`state.name = '${StateName.VALID}'`)
        .getRawOne();

      if (
        parseFloat(interests.totalInterests) >= goldSuscription.upgradedAmount
      )
        return true;
    }
    return false;
  }

  async sendGoldSubscriptionUpgradeEmail(userClient: UserClient) {
    const pointsConversion = await this.pointsConversionService.getRecentPointsConversion();
    const platformInterestService = await this.platformInterestService.getInterestByName(
      PlatformInterest.GOLD_EXTRA,
    );

    const languageMails = userClient.userDetails.language.name;

    const extraPoints =
      parseFloat(platformInterestService.amount) /
      (100 * pointsConversion.onePointEqualsDollars);

    const template = `upgradeToGold[${languageMails}]`;

    const subject = mailsSubjets.upgrade_to_gold[languageMails];

    const msg = {
      to: userClient.email,
      subject: subject,
      templateId: this.configService.get<string>(
        `mails.sendgrid.templates.${template}`,
      ),
      dynamic_template_data: {
        user: userClient.userDetails.firstName,
        extraPoints,
      },
    };
    this.mailsService.sendEmail(msg);
  }

  async upgradeSubscriptionIfIsPossible(
    idUserClient: number,
    transactionType: TransactionType,
  ) {
    const userClient = await this.userClientService.get({ idUserClient });

    //--- Put here the upgrade  if the transaction is a transaction to upgrade to PREMIUM

    if (await this.isAbleToUpgradeToGold(userClient)) {
      await this.createUserSuscription(userClient, SuscriptionType.GOLD);
      await this.sendGoldSubscriptionUpgradeEmail(userClient);
    }
  }

  async getActualSubscription(email: string): Promise<Suscription> {
    const userId = await this.userClientRepository.findOne({ email });
    const actualSubscription = await this.suscriptionRepository
      .createQueryBuilder('subscription')
      .innerJoin('subscription.userSuscription', 'us')
      .where(`us.fk_user_client = :id`, { id: userId.idUserClient })
      .andWhere('us."finalDate" is null')
      .getOne();
    return actualSubscription;
  }
}
