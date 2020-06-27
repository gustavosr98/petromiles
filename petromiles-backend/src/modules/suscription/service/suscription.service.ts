import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getConnection, getManager, getRepository, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';

// CONSTANTS
import { MailsSubjets } from '@/constants/mailsSubjectConst';

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
import { PlatformInterest as PlatformInterestEntity } from '@/entities/platform-interest.entity';

// SERVICES
import { UserClientService } from '@/modules/user/services/user-client.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { MailsService } from '@/modules/mails/mails.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';

@Injectable()
export class SuscriptionService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    @InjectRepository(Suscription)
    private suscriptionRepository: Repository<Suscription>,
    @InjectRepository(PlatformInterestEntity)
    private platformInterestRepository: Repository<PlatformInterestEntity>,
    private userClientService: UserClientService,
    private clientBankAccountService: ClientBankAccountService,
    private transactionService: TransactionService,
    private pointsConversionService: PointsConversionService,
    private platformInterestService: PlatformInterestService,
    private mailsService: MailsService,
    private configService: ConfigService,
    private paymentProviderService: PaymentProviderService,
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
  ): Promise<Transaction> {
    const userClient = await this.userClientService.get({ email });
    const suscription = await this.get(SuscriptionType.PREMIUM);

    const clientBankAccount = await this.clientBankAccountService.getOne(
      userClient.idUserClient,
      idBankAccount,
    );

    const paymentProviderCharge = await this.paymentProviderService.createCharge(
      {
        customer: clientBankAccount.userClient.userDetails.customerId,
        source: clientBankAccount.chargeId,
        currency: 'usd',
        amount: suscription.cost,
      },
    );

    const transaction = await this.transactionService.createUpgradeSuscriptionTransaction(
      clientBankAccount,
      suscription,
      paymentProviderCharge.id,
    );

    this.logger.silly(
      `[${ApiModules.PAYMENTS}] Bank account {client: ${
        clientBankAccount.userClient.email
      } | id: ${
        clientBankAccount.idClientBankAccount
      } | last4: ${clientBankAccount.bankAccount.accountNumber.substr(
        -4,
      )}} charged with USD [${(suscription.cost / 100).toFixed(2)}]`,
    );

    return transaction;
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

    const subject = MailsSubjets.upgrade_to_gold[languageMails];

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
    transaction: Transaction,
  ) {
    const userClient = await this.userClientService.get({ idUserClient });

    if (transaction.type === TransactionType.SUSCRIPTION_PAYMENT)
      await this.createUserSuscription(
        userClient,
        SuscriptionType.PREMIUM,
        transaction,
      );

    if (await this.isAbleToUpgradeToGold(userClient)) {
      await this.createUserSuscription(userClient, SuscriptionType.GOLD);
      await this.sendGoldSubscriptionUpgradeEmail(userClient);
    }
  }

  async getActualSubscription(id: number): Promise<Suscription> {
    const actualSubscription = await this.suscriptionRepository
      .createQueryBuilder('subscription')
      .innerJoin('subscription.userSuscription', 'us')
      .where(`us.fk_user_client = :id`, { id })
      .andWhere('us."finalDate" is null')
      .getOne();
    return actualSubscription;
  }

  async getSubscriptionPercentage(subscription: string) {
    const actualSubscription = await this.platformInterestRepository
      .createQueryBuilder('pi')
      .where('pi.name = :type', { type: subscription })
      .andWhere('pi.finalDate IS NULL')
      .getOne();

    const pointsConversion = await this.pointsConversionService.getRecentPointsConversion();

    if (actualSubscription.isGold()) {
      const points =
        parseFloat(actualSubscription.amount) /
        (100 * pointsConversion.onePointEqualsDollars);
      const GoldInfo = await this.getGoldInfo();
      const actualPercentage = parseFloat(actualSubscription.percentage) * 100;
      return {
        points: points,
        amountUpgrade: GoldInfo,
        percentage: actualPercentage,
      };
    }
    const actualPercentage = parseFloat(actualSubscription.percentage) * 100;
    return { percentage: actualPercentage };
  }

  async getGoldInfo() {
    const upgradeAmount = await this.suscriptionRepository
      .createQueryBuilder('su')
      .where('su.name = :name', { name: SuscriptionType.GOLD })
      .getOne();

    const amount = upgradeAmount.upgradedAmount / 100;
    return await amount;
  }
}
