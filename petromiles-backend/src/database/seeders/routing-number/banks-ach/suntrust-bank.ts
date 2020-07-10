import { Bank } from '@/enums/bank.enum';

const bank: {
  bankName: Bank;
  achs: string[];
} = {
  bankName: Bank.SUNTRUST_BANK,
  achs: ['061000104'],
};

export default bank;
