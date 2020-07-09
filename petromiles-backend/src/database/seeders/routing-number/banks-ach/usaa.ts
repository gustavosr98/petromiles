import { Bank } from '@/enums/bank.enum';

const bank: {
  bankName: Bank;
  achs: string[];
} = {
  bankName: Bank.USAA,
  achs: ['314074269'],
};

export default bank;
