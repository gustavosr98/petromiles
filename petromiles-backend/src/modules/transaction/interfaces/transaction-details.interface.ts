import { TransactionType } from '@/enums/transaction.enum';

interface TransactionDetails {
  id: number;
  date: string;
  type: TransactionType;
  bankAccount: string;
  state: string;
  amount: number;
  interest: number;
  pointsEquivalent?: number;
  pointsConversion: number;
  total: number;
}

export { TransactionDetails };
