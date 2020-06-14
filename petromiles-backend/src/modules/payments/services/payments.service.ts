import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// CONSTANTS
import { mailsSubjets } from '@/constants/mailsSubjectConst';

// SERVICES
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { MailsService } from '@/modules/mails/mails.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';

// ENTITIES
import { Transaction } from '@/entities/transaction.entity';
import { UserClient } from '@/entities/user-client.entity';
import { PointsConversion } from '@/entities/points-conversion.entity';

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
    private transactionService: TransactionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
    private platformInterestService: PlatformInterestService,
    private userClientService: UserClientService,
    private pointsConversionService: PointsConversionService,
    private paymentProviderService: PaymentProviderService,
    private mailsService: MailsService,
    private configService: ConfigService,
  ) {}

  async getOnePointToDollars(): Promise<PointsConversion> {
    const mostRecentRate = await this.pointsConversionService.getRecentPointsConversion();
    return mostRecentRate;
  }

  async getInterests(
    trasactionType: TransactionType,
    platformInterestType,
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
    idUserClient: number,
    idClientBankAccount: number,
    amount,
    amountToCharge,
  ): Promise<Transaction> {
    const clientBankAccount = await this.clientBankAccountService.getOne(
      idUserClient,
      idClientBankAccount,
    );

    const charge = await this.paymentProviderService.createCharge({
      customer: clientBankAccount.userClient.userDetails.customerId,
      source: clientBankAccount.chargeId,
      currency: 'usd',
      amount: amountToCharge,
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
      )}} charged with USD [raw ${(amount / 100).toFixed(2)}| total ${(
        amountToCharge / 100
      ).toFixed(2)}]`,
    );

    return deposit;
  }

  async withdrawPoints(
    user,
    idClientBankAccount,
    amount,
    amountToCharge,
  ): Promise<Transaction> {
    const { id, email } = user;
    const clientBankAccount = await this.clientBankAccountService.getOne(
      id,
      idClientBankAccount,
    );

    if (await this.verifyEnoughPoints(email, amount)) {
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
        amount: amountToCharge,
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
  private async verifyEnoughPoints(email: string, amount: number) {
    const { dollars } = await this.userClientService.getPoints(email);
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

  async sendInvoiceEmail(user, file) {
    let userClient = await getConnection()
      .getRepository(UserClient)
      .findOne({ email: user.email });

    const languageMails = userClient.userDetails.language.name;

    const template = `invoice[${languageMails}]`;

    const subject = mailsSubjets.invoice[languageMails];

    this.mailsService.sendEmail({
      to: userClient.email,
      subject: subject,
      templateId: this.configService.get(
        `mails.sendgrid.templates.${template}`,
      ),
      dynamic_template_data: { user: userClient.userDetails.firstName },
      attachments: [
        {
          filename: `PetroMiles[invoice]-${new Date().toLocaleDateString()}`,
          type: file.mimetype,
          content: file.buffer.toString('base64'),
        },
      ],
    });
  }
}
