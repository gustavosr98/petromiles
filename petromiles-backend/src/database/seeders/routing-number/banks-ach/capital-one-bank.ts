import { Bank } from '@/enums/bank.enum';

const bank: {
  bankName: Bank;
  achs: string[];
} = {
  bankName: Bank.CAPITAL_ONE_BANK,
  achs: ['051405515', '056073502'],
};

export default bank;
