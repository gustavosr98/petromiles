import { Interest } from './interest.interface';
import { TransactionType } from './../transaction/transaction/transaction.enum';
import { PointsConversionService } from '@/modules/management/points-conversion/points-conversion.service';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// SERVICES
import { BankAccountService } from '../bank-account/bank-account.service';
import { TransactionService } from '../transaction/transaction.service';
import { ThirdPartyInterestService } from '../management/third-party-interest/third-party-interest.service';
import { PlatformInterestService } from '../management/platform-interest/platform-interest.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';

// ENTITIES
import { Transaction } from '../transaction/transaction/transaction.entity';
import { UserService } from '../user/user.service';
import { PlatformInterest } from '../management/platform-interest/platform-interest.enum';

// INTERFACES
import { Suscription } from '../suscription/suscription/suscription.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { PaymentProvider } from './../payment-provider/payment-provider.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private bankAccountService: BankAccountService,
    private transactionService: TransactionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
    private platformInterestService: PlatformInterestService,
    private userService: UserService,
    private pointsConversionService: PointsConversionService,
    private paymentProviderService: PaymentProviderService,
  ) {}

  async getOnePointToDollars(): Promise<number> {
    const mostRecentRate = await this.pointsConversionService.getRecentPointsConversion();
    return mostRecentRate.onePointEqualsDollars;
  }

  async getInterests(trasactionType: TransactionType): Promise<Interest[]> {
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
      PlatformInterest.BUY,
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
    const clientBankAccount = await this.bankAccountService.getClientBankAccount(
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

    return await this.transactionService.createDeposit(
      clientBankAccount,
      extraPointsType,
      amount,
      charge.id,
    );
  }

  async withdrawPoints(
    user,
    idClientBankAccount,
    amount,
  ): Promise<Transaction> {
    const { id, email } = user;
    const clientBankAccount = await this.bankAccountService.getClientBankAccount(
      id,
      idClientBankAccount,
    );

    if (await this.verifyEnoughPoints(email, amount)) {
      return this.transactionService.createWithdrawalTransaction(
        clientBankAccount,
        amount,
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
    const { dollars } = await this.userService.getPoints(email);
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
}
