import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import {
  getConnection,
  getRepository,
  Repository,
  UpdateResult,
} from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// CONSTANTS
import { MailsSubjets } from '@/constants/mailsSubjectConst';

// INTERFACES
import { Suscription as SuscriptionType } from '@/enums/suscription.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { StateName } from '@/enums/state.enum';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { UpdateSubscriptionDTO } from '@/modules/suscription/dto/update-subscription.dto';
import { StateDescription } from '@/enums/state.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';

// ENTITIES
import { UserClient } from '@/entities/user-client.entity';
import { Transaction } from '@/entities/transaction.entity';
import { Suscription } from '@/entities/suscription.entity';
import { UserSuscription } from '@/entities/user-suscription.entity';
import { PlatformInterest as PlatformInterestEntity } from '@/entities/platform-interest.entity';
import { StateTransaction } from '@/entities/state-transaction.entity';

// SERVICES
import { UserClientService } from '@/modules/user/services/user-client.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { MailsService } from '@/modules/mails/mails.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';

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
    @InjectRepository(StateTransaction)
    private stateTransactionRepository: Repository<StateTransaction>,
    private userClientService: UserClientService,
    private clientBankAccountService: ClientBankAccountService,
    private transactionService: TransactionService,
    private pointsConversionService: PointsConversionService,
    private platformInterestService: PlatformInterestService,
    private mailsService: MailsService,
    private configService: ConfigService,
    private paymentProviderService: PaymentProviderService,
    private thirdPartyInterestService: ThirdPartyInterestService,
  ) {}
  async get(suscriptionType: SuscriptionType): Promise<Suscription> {
    return await getConnection()
      .getRepository(Suscription)
      .findOne({ name: suscriptionType });
  }

  async getAll(): Promise<Suscription[]> {
    return await this.suscriptionRepository.find();
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

  async hasPendingUpgrade(iduserClient: number): Promise<boolean> {
    const status = await this.stateTransactionRepository
      .createQueryBuilder('st')
      .select('s.name')
      .leftJoin('st.state', 's')
      .leftJoin('st.transaction', 't')
      .leftJoin('t.clientBankAccount', 'cba')
      .where('st."finalDate" IS NULL')
      .andWhere('cba.fk_user_client = :id', { id: iduserClient })
      .andWhere('t.type = :type', { type: TransactionType.SUSCRIPTION_PAYMENT })
      .andWhere('st.description = :description', {
        description: StateDescription.SUSCRIPTION_UPGRADE,
      })
      .getRawOne();

    if (status === undefined) {
      return false;
    }
    return status.s_name === StateName.VERIFYING;
  }

  async upgradeToPremium(
    email: string,
    idBankAccount: number,
    costSuscription: number,
  ): Promise<Transaction> {
    const userClient = await this.userClientService.get({ email });
    const suscription = await this.get(SuscriptionType.PREMIUM);
    const idUserClient = userClient.idUserClient;

    const thirdPartyInterest = await this.thirdPartyInterestService.getCurrentInterest(
      PaymentProvider.STRIPE,
      TransactionType.DEPOSIT,
    );

    if (suscription.cost !== costSuscription) {
      this.logger.error(
        `[${ApiModules.SUSCRIPTION}] The user has no updated configuration parameters`,
      );
      throw new BadRequestException(`error-messages.oldPlatformConfiguration`);
    }

    const clientBankAccount = await this.clientBankAccountService.getOne(
      userClient.idUserClient,
      idBankAccount,
    );

    if (await this.hasPendingUpgrade(idUserClient)) {
      this.logger.error(
        `[${ApiModules.SUSCRIPTION}] Pending upgrade transaction {client: ${idUserClient}}`,
      );
      throw new BadRequestException('error-messages.pendingUpgradeTransaction');
    }
    const actualSubscription = await this.getUserSuscription(userClient);

    if (actualSubscription.suscription.name === SuscriptionType.PREMIUM) {
      this.logger.error(
        `[${ApiModules.SUSCRIPTION}] Already premium {client: ${idUserClient}}`,
      );
      throw new BadRequestException('error-messages.alreadyPremium');
    } else if (actualSubscription.suscription.name === SuscriptionType.GOLD) {
      this.logger.error(
        `[${ApiModules.SUSCRIPTION}] Gold users cannot request premium suscription {client: ${idUserClient}}`,
      );
      throw new BadRequestException('error-messages.goldUser');
    }

    const paymentProviderCharge = await this.paymentProviderService.createCharge(
      {
        customer: clientBankAccount.userClient.userDetails.customerId,
        source: clientBankAccount.chargeId,
        currency: 'usd',
        amount: Math.trunc(
          suscription.cost + thirdPartyInterest.amountDollarCents,
        ),
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
      )}} charged with USD [${Math.round(suscription.cost) / 100}]`,
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

    if (actualSubscription.isGold()) {
      const GoldInfo = await this.getGoldInfo();
      const actualPercentage = parseFloat(actualSubscription.percentage) * 100;
      return {
        points: actualSubscription.points,
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

  async getActualCost(subscriptionName: SuscriptionType): Promise<Suscription> {
    const cost = await this.suscriptionRepository
      .createQueryBuilder('subscription')
      .where(`subscription.name = :name`, { name: subscriptionName })
      .getOne();

    return cost;
  }

  async update(
    updateSubscriptionDTO: UpdateSubscriptionDTO,
    idSuscription: number,
  ): Promise<UpdateResult> {
    return await this.suscriptionRepository
      .createQueryBuilder()
      .update(Suscription)
      .set({ ...updateSubscriptionDTO })
      .where('idSuscription = :id', { id: idSuscription })
      .execute();
  }
}
