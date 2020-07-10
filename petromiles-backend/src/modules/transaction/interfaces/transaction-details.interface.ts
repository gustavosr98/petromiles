import { TransactionType } from '@/enums/transaction.enum';

interface TransactionDetails {
  id: number;
  date: string;
  fullDate?: string;
  type: TransactionType;
  bankAccount: string;
  clientBankAccountEmail: string;
  state: string;
  amount: number;
  interest: number;
  pointsEquivalent?: number;
  pointsConversion: number;
  total: number;
}

export { TransactionDetails };
