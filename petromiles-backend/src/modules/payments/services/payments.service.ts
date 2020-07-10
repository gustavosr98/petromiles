import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { getConnection, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// CONSTANTS
import { MailsSubjets } from '@/constants/mailsSubjectConst';

// SERVICES
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { MailsService } from '@/modules/mails/mails.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';

// ENTITIES
import { Transaction } from '@/entities/transaction.entity';
import { UserClient } from '@/entities/user-client.entity';
import { PointsConversion } from '@/entities/points-conversion.entity';
import { ClientBankAccount } from '@/entities/client-bank-account.entity';

// INTERFACES
import { Suscription } from '@/enums/suscription.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { Interest } from '@/modules/payments/interest.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private clientBankAccountService: ClientBankAccountService,
    @InjectRepository(ClientBankAccount)
    private clientBankAccountRepository: Repository<ClientBankAccount>,
    private transactionService: TransactionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
    private platformInterestService: PlatformInterestService,
    private userClientService: UserClientService,
    private pointsConversionService: PointsConversionService,
    private paymentProviderService: PaymentProviderService,
    private mailsService: MailsService,
    private configService: ConfigService,
    private suscriptionService: SuscriptionService,
  ) {}

  async getOnePointToDollars(): Promise<PointsConversion> {
    const mostRecentRate = await this.pointsConversionService.getRecentPointsConversion();
    return mostRecentRate;
  }

  async getInterests(
    trasactionType: TransactionType,
    platformInterestType: PlatformInterest,
  ): Promise<Interest[]> {
    let interests: Interest[] = [];
    const thirdPartyInterest = await this.thirdPartyInterestService.get(
      PaymentProvider.STRIPE,
      trasactionType,
    );
    interests.push({
      operation: 1,
      amount: thirdPartyInterest.amountDollarCents || 0,
      percentage: thirdPartyInterest.percentage || 0,
    });

    const platformInterest = await this.platformInterestService.getInterestByName(
      platformInterestType,
    );
    interests.push({
      operation: 1,
      amount: parseFloat(platformInterest.amount) || 0,
      percentage: parseFloat(platformInterest.percentage) || 0,
    });

    return interests;
  }

  async buyPoints(
    idClientBankAccount: number,
    amount,
    amountToCharge,
    points,
    subscriptionName,
    infoSubscription,
  ): Promise<Transaction> {
    const interests = await this.getInterests(
      TransactionType.DEPOSIT,
      PlatformInterest.BUY,
    );
    const onePointToDollars = (await this.getOnePointToDollars())
      .onePointEqualsDollars;

    let infoSubscriptionAct;
    if (subscriptionName !== 'basic') {
      infoSubscriptionAct = await this.suscriptionService.getSubscriptionPercentage(
        subscriptionName,
      );
    } else {
      infoSubscriptionAct = {};
    }

    const rawCost = Math.round(points * onePointToDollars * 10000) / 10000;
    let result = rawCost;
    interests.map(i => {
      result = result + rawCost * i.percentage + i.amount / 100;
    });
    const costWithInterests = Math.round(result * 10000) / 10000;
    const amountToChargeAct = Math.round(costWithInterests * 10000) / 100;

    if (
      amountToCharge !== amountToChargeAct ||
      JSON.stringify(infoSubscription) !== JSON.stringify(infoSubscriptionAct)
    ) {
      this.logger.error(
        `[${ApiModules.PAYMENTS}] The user has no updated configuration parameters`,
      );
      throw new BadRequestException(`error-messages.oldPlatformConfiguration`);
    }

    const clientBankAccount = await this.clientBankAccountRepository.findOne({
      idClientBankAccount,
    });

    const charge = await this.paymentProviderService.createCharge({
      customer: clientBankAccount.userClient.userDetails.customerId,
      source: clientBankAccount.chargeId,
      currency: 'usd',
      amount: Math.round(amountToCharge),
    });

    let currentUserSuscription = clientBankAccount.userClient.userSuscription.find(
      suscription => !suscription.finalDate,
    );

    const extraPointsType = this.chooseExtraPoints(
      currentUserSuscription.suscription.name,
    );

    const deposit = await this.transactionService.createDeposit(
      clientBankAccount,
      extraPointsType,
      amount,
      charge.id,
    );

    this.logger.silly(
      `[${ApiModules.PAYMENTS}] Bank account {client: ${
        clientBankAccount.userClient.email
      } | id: ${idClientBankAccount} | last4: ${clientBankAccount.bankAccount.accountNumber.substr(
        -4,
      )}} charged with USD [raw ${Math.round(amount) / 100}| total ${Math.round(
        amountToCharge,
      ) / 100}]`,
    );

    return deposit;
  }

  async withdrawPoints(
    user,
    idClientBankAccount,
    amount,
    amountToCharge,
    points,
  ): Promise<Transaction> {
    const interests = await this.getInterests(
      TransactionType.WITHDRAWAL,
      PlatformInterest.WITHDRAWAL,
    );
    const onePointToDollars = (await this.getOnePointToDollars())
      .onePointEqualsDollars;

    const rawCost = Math.round(points * onePointToDollars * 10000) / 10000;
    let result = rawCost;
    interests.map(i => {
      result = result - (rawCost * i.percentage + i.amount / 100);
    });
    const costWithInterests = Math.round(result * 10000) / 10000;
    const amountToChargeAct = Math.round(costWithInterests * 10000) / 100;

    if (amountToCharge !== amountToChargeAct) {
      this.logger.error(
        `[${ApiModules.PAYMENTS}] The user has no updated configuration parameters`,
      );
      throw new BadRequestException(`error-messages.oldPlatformConfiguration`);
    }

    const { email, id } = user;

    const clientBankAccount = await this.clientBankAccountRepository.findOne({
      idClientBankAccount,
    });

    if (await this.verifyEnoughPoints(id, amount)) {
      await this.paymentProviderService.updateBankAccountOfAnAccount(
        clientBankAccount.userClient.userDetails.accountId,
        clientBankAccount.transferId,
        {
          default_for_currency: true,
        },
      );

      const transfer = await this.paymentProviderService.createTransfer({
        destination: clientBankAccount.userClient.userDetails.accountId,
        currency: 'usd',
        amount: Math.round(amountToCharge),
        source_type: 'bank_account',
      });

      return this.transactionService.createWithdrawalTransaction(
        clientBankAccount,
        amount,
        transfer.id,
      );
    }

    this.logger.error(
      `[${ApiModules.PAYMENTS}] {${email}} does not have enough points`,
    );
    throw new BadRequestException(`{${email}} does not have enough points`);
  }

  private chooseExtraPoints(suscriptionType): PlatformInterest {
    if (suscriptionType == Suscription.BASIC) return null;
    if (suscriptionType == Suscription.PREMIUM)
      return PlatformInterest.PREMIUM_EXTRA;
    return PlatformInterest.GOLD_EXTRA;
  }

  // Only verify points of valid transactions
  private async verifyEnoughPoints(idUserClient: number, amount: number) {
    const { dollars } = await this.userClientService.getPoints(idUserClient);
    const thirdPartyInterest = await this.thirdPartyInterestService.get(
      PaymentProvider.STRIPE,
      TransactionType.WITHDRAWAL,
    );
    const platformInterest = (
      await this.platformInterestService.getInterestByName(
        PlatformInterest.WITHDRAWAL,
      )
    ).percentage;

    // Calculate total amount of interests
    const interests =
      thirdPartyInterest.amountDollarCents +
      parseFloat(platformInterest) * amount;

    if (dollars * 100 >= interests) return true;

    return false;
  }

  async sendPaymentInvoiceEmail(user, file) {
    const userClient = await getConnection()
      .getRepository(UserClient)
      .findOne({ email: user.email });

    const transactionCode = await this.transactionService.getTransactions(
      userClient.idUserClient,
    );

    const transaction = await getConnection()
      .getRepository(Transaction)
      .findOne({
        idTransaction: (await transactionCode[transactionCode.length - 1]).id,
      });

    const languageMails = userClient.userDetails.language.name;

    const template = `invoice[${languageMails}]`;

    const subject = MailsSubjets.invoice[languageMails];

    this.mailsService.sendEmail({
      to: userClient.email,
      subject: subject,
      templateId: this.configService.get(
        `mails.sendgrid.templates.${template}`,
      ),
      dynamic_template_data: { user: userClient.userDetails.firstName },
      attachments: [
        {
          filename: `PetroMiles[invoice]-${new Date().toLocaleDateString()}-${
            transaction.paymentProviderTransactionId
          }`,
          type: file.mimetype,
          content: file.buffer.toString('base64'),
        },
      ],
    });
  }

  async sendWithdrawalInvoiceEmail(user, file, points, total) {
    let userClient = await getConnection()
      .getRepository(UserClient)
      .findOne({ email: user.email });

    const transactionCode = await this.transactionService.getTransactions(
      userClient.idUserClient,
    );

    const transaction = await getConnection()
      .getRepository(Transaction)
      .findOne({
        idTransaction: (await transactionCode[transactionCode.length - 1]).id,
      });

    const languageMails = userClient.userDetails.language.name;

    const template = `withdrawal[${languageMails}]`;

    const subject = MailsSubjets.invoice[languageMails];

    this.mailsService.sendEmail({
      to: userClient.email,
      subject: subject,
      templateId: this.configService.get(
        `mails.sendgrid.templates.${template}`,
      ),
      dynamic_template_data: {
        user: userClient.userDetails.firstName,
        numberPoints: points,
        dollarWithdrawal: total,
      },
      attachments: [
        {
          filename: `PetroMiles[invoice]-${new Date().toLocaleDateString()}-${
            transaction.paymentProviderTransactionId
          }`,
          type: file.mimetype,
          content: file.buffer.toString('base64'),
        },
      ],
    });
  }
}
