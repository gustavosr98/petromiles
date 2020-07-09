import { Bank } from '@/enums/bank.enum';

const bank: {
  bankName: Bank;
  achs: string[];
} = {
  bankName: Bank.HSBC_BANK_USA,
  achs: ['021001088'],
};

export default bank;
