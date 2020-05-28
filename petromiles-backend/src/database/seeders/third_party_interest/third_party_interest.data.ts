import { PaymentProvider } from './../../../modules/payment-provider/payment-provider.enum';
/* eslint-disable @typescript-eslint/camelcase */
import { TransactionType } from '@/modules/transaction/transaction/transaction.enum';

export const THIRD_PARTY_INTEREST = [
  {
    idThirdPartyInterest: 1,
    transactionType: TransactionType.DEPOSIT,
    paymentProvider: PaymentProvider.STRIPE,
    name: 'Transaction Interest',
    amountDollarCents: 75,
  },
  {
    idThirdPartyInterest: 2,
    transactionType: TransactionType.WITHDRAWAL,
    paymentProvider: PaymentProvider.STRIPE,
    name: 'Transaction Interest',
    amountDollarCents: 75,
  },
];
