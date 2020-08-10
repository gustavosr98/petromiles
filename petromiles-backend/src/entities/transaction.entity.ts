import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Transform } from 'class-transformer';

import { TransactionDetails } from '@/modules/transaction/interfaces/transaction-details.interface';

import { UserSuscription } from '@/entities/user-suscription.entity';
import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { StateTransaction } from '@/entities/state-transaction.entity';
import { TransactionInterest } from '@/entities/transaction-interest.entity';
import { PointsConversion } from '@/entities/points-conversion.entity';
import { TransactionType } from '@/enums/transaction.enum';
import { ClientOnThirdParty } from '@/entities/client-on-third-party.entity';
import { PlatformInterest } from '@/enums/platform-interest.enum';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTransaction: number;

  idUserClient?: number;

  @Transform(date => date.toLocaleDateString())
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initialDate: Date;

  @Column('decimal', { precision: 12, scale: 3 })
  rawAmount: number;

  @Column('decimal', { precision: 12, scale: 3 })
  totalAmountWithInterest: number;

  @Column()
  type: TransactionType;

  @Column({ nullable: true })
  operation?: number;

  @Column({ nullable: true })
  paymentProviderTransactionId?: string;

  @ManyToOne(
    type => Transaction,
    transaction => transaction.idTransaction,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;

  @OneToOne(
    type => UserSuscription,
    userSuscription => userSuscription.transaction,
    { nullable: true },
  )
  userSuscription: UserSuscription;

  @OneToMany(
    type => StateTransaction,
    stateTransaction => stateTransaction.transaction,
    { nullable: false, eager: true },
  )
  stateTransaction: StateTransaction[];

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.transaction,
    { nullable: true, eager: true },
  )
  transactionInterest: TransactionInterest[];

  @ManyToOne(
    type => PointsConversion,
    pointsConversion => pointsConversion.idPointsConversion,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_points_conversion' })
  pointsConversion: PointsConversion;

  @ManyToOne(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.idClientBankAccount,
    { nullable: true, eager: true },
  )
  @JoinColumn({ name: 'fk_client_bank_account' })
  clientBankAccount?: ClientBankAccount;

  @ManyToOne(
    type => ClientOnThirdParty,
    clientOnThirdParty => clientOnThirdParty.idClientOnThirdParty,
    { nullable: true, eager: true },
  )
  @JoinColumn({ name: 'fk_client_on_third_party' })
  clientOnThirdParty?: ClientOnThirdParty;

  calculateDetails(): TransactionDetails {
    const state = this.stateTransaction.find(state => !state.finalDate).state
      .name;
    let details;

    if (this.type == TransactionType.BANK_ACCOUNT_VALIDATION)
      details = this.calculateVerificationDetails();
    if (this.type == TransactionType.SUSCRIPTION_PAYMENT)
      details = this.calculateSubscriptionDetails();
    if (
      this.type == TransactionType.DEPOSIT ||
      this.type == TransactionType.THIRD_PARTY_CLIENT
    )
      details = this.calculateDepositDetails();
    if (this.type == TransactionType.WITHDRAWAL)
      details = this.calculateWithdrawalDetails();

    const bankAccount = this.clientBankAccount
      ? this.clientBankAccount.bankAccount.accountNumber.substr(-4)
      : null;

    const bankAccountNickname = this.clientBankAccount
      ? this.clientBankAccount.bankAccount.nickname
      : null;

    const clientBankAccountEmail = this.clientBankAccount
      ? this.clientBankAccount.userClient.email
      : this.clientOnThirdParty.userClient.email;

    return {
      id: this.idTransaction,
      date: this.initialDate.toUTCString(),
      fullDate: this.initialDate,
      type: this.type,
      bankAccount,
      bankAccountNickname,
      clientBankAccountEmail,
      thirdPartyClient: this.clientOnThirdParty
        ? this.clientOnThirdParty.thirdPartyClient.name
        : null,
      pointsConversion: Math.round(
        1 / this.pointsConversion.onePointEqualsDollars,
      ),
      ...details,
      state,
    };
  }

  private calculateVerificationDetails() {
    const verificationInterest =
      parseFloat(this.transactionInterest[0].platformInterest.amount) / 100;

    return {
      amount: verificationInterest,
      interest: 0,
      total: verificationInterest,
    };
  }

  private calculateSubscriptionDetails() {
    const subscriptionCost = this.totalAmountWithInterest / 100;
    const thirdPartyInterest =
      this.transactionInterest[0].thirdPartyInterest.amountDollarCents / 100;
    return {
      amount:
        Math.round((subscriptionCost - thirdPartyInterest) * 10000) / 10000,
      interest: Math.round(thirdPartyInterest * 10000) / 10000,
      total: subscriptionCost,
    };
  }

  private calculateDepositDetails() {
    const conversion = this.pointsConversion.onePointEqualsDollars;
    const amount = Math.round(this.rawAmount * 100) / 10000;
    const details = {
      amount,
      pointsEquivalent: Math.round(
        amount / this.pointsConversion.onePointEqualsDollars,
      ),
      interest: Math.round(this.totalAmountWithInterest * 100) / 10000,
      extra: 0,
    };

    const extraPoints = this.transactionInterest[0].platformInterestExtraPoints;

    // If user has premium or gold subscription
    if (extraPoints) {
      // Amount purchased by the client
      let rawAmount = amount;

      if (extraPoints.name === PlatformInterest.GOLD_EXTRA)
        rawAmount = amount - extraPoints.points * conversion;

      rawAmount = rawAmount / (1 + parseFloat(extraPoints.percentage));

      details.pointsEquivalent = Math.round(
        rawAmount / this.pointsConversion.onePointEqualsDollars,
      );

      if (this.type === TransactionType.THIRD_PARTY_CLIENT)
        details.amount = amount;
      else details.amount = Math.round(rawAmount * 10000) / 10000;

      details.extra = Math.round(
        (amount - rawAmount) / this.pointsConversion.onePointEqualsDollars,
      );
    }

    const total =
      Math.round((details.amount + details.interest) * 10000) / 10000;

    return { ...details, total };
  }

  private calculateWithdrawalDetails() {
    const amount = Math.round(this.rawAmount * 100) / 10000;
    const interest =
      (Math.round(this.totalAmountWithInterest * 100) / 10000) * -1;
    const total = Math.round((amount + interest) * 100) / 100;
    const pointsEquivalent = Math.round(
      amount / this.pointsConversion.onePointEqualsDollars,
    );
    const extra = 0;
    return { amount, interest, total, pointsEquivalent, extra };
  }
}
