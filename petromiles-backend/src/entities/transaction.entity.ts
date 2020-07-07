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

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTransaction: number;

  idUserClient?: number;

  @Transform(date => date.toLocaleDateString())
  @Column({ default: () => 'CURRENT_DATE' })
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
      date: this.initialDate.toLocaleDateString(),
      type: this.type,
      bankAccount,
      bankAccountNickname,
      clientBankAccountEmail,
      thirdPartyClient: this.clientOnThirdParty
        ? this.clientOnThirdParty.thirdPartyClient.name
        : null,
      pointsConversion: (
        1 / this.pointsConversion.onePointEqualsDollars
      ).toFixed(0),
      ...details,
      state,
    };
  }

  calculateDetailsAdministrator(): TransactionDetails {
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
      date: this.initialDate.toLocaleDateString(),
      type: this.type,
      bankAccount,
      bankAccountNickname,
      thirdPartyClient: this.clientOnThirdParty
        ? this.clientOnThirdParty.thirdPartyClient.name
        : null,
      pointsConversion: 1 / this.pointsConversion.onePointEqualsDollars,
      ...details,
      state,
      clientBankAccountEmail,
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
      amount: (subscriptionCost - thirdPartyInterest).toFixed(2),
      interest: thirdPartyInterest.toFixed(2),
      total: subscriptionCost,
    };
  }

  private calculateDepositDetails() {
    const amount = parseFloat((this.rawAmount / 100).toFixed(2));
    const details = {
      amount,
      pointsEquivalent: Math.round(
        amount / this.pointsConversion.onePointEqualsDollars,
      ),
      interest:
        Math.round(
          parseFloat((this.totalAmountWithInterest / 100).toFixed(2)) * 100,
        ) / 100,
      extra: 0,
    };

    const extraPoints = this.transactionInterest[0].platformInterestExtraPoints;

    // If user has premium or gold subscription
    if (extraPoints) {
      // Amount purchased by the client
      let rawAmount = extraPoints.amount
        ? amount - parseFloat(extraPoints.amount) / 100
        : amount;

      rawAmount = rawAmount / (1 + parseFloat(extraPoints.percentage));

      details.amount = Math.round(rawAmount * 100) / 100;

      details.extra = Math.round(
        (amount - rawAmount) / this.pointsConversion.onePointEqualsDollars,
      );

      details.pointsEquivalent = Math.round(
        details.amount / this.pointsConversion.onePointEqualsDollars,
      );
    }

    const total = Math.round((details.amount + details.interest) * 100) / 100;

    return { ...details, total };
  }

  private calculateWithdrawalDetails() {
    const amount = parseFloat((this.rawAmount / 100).toFixed(2));
    const interest =
      parseFloat((this.totalAmountWithInterest / 100).toFixed(2)) * -1;
    const total = Math.round((amount + interest) * 100) / 100;
    const pointsEquivalent = Math.round(
      amount / this.pointsConversion.onePointEqualsDollars,
    );
    const extra = 0;
    return { amount, interest, total, pointsEquivalent, extra };
  }
}
