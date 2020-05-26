import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { BankAccountService } from '../bank-account/bank-account.service';
import { Suscription } from '../suscription/suscription/suscription.enum';
import { PlatformInterest } from '../management/platform-interest/platform-interest.enum';
import { TransactionService } from '../transaction/transaction.service';

import { Transaction } from '../transaction/transaction/transaction.entity';
import { UserService } from '../user/user.service';
import { ThirdPartyInterestService } from '../management/third-party-interest/third-party-interest.service';
import { PlatformInterestService } from '../management/platform-interest/platform-interest.service';
import { ThirdPartyInterest } from '../management/third-party-interest/third-party-interest.enum';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiModules } from '@/logger/api-modules.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private bankAccountService: BankAccountService,
    private transactionService: TransactionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
    private platformInterestService: PlatformInterestService,
    private userService: UserService,
  ) {}

  async buyPoints(
    idUserClient,
    idClientBankAccount,
    amount,
  ): Promise<Transaction> {
    const clientBankAccount = await this.bankAccountService.getClientBankAccount(
      idUserClient,
      idClientBankAccount,
    );

    let currentUserSuscription = clientBankAccount.userClient.userSuscription.find(
      suscription => !suscription.finalDate,
    );

    const extraPointsType = this.chooseExtraPoints(
      currentUserSuscription.suscription.name,
    );

    return await this.transactionService.createDepositTransaction(
      clientBankAccount,
      extraPointsType,
      amount,
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
    const thirdPartyInterest = await this.thirdPartyInterestService.getThirdPartyInterest(
      ThirdPartyInterest.STRIPE,
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
