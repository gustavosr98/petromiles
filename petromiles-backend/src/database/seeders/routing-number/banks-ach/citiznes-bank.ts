import { Bank } from '@/enums/bank.enum';

const bank: {
  bankName: Bank;
  achs: string[];
} = {
  bankName: Bank.CITIZENS_BANK,
  achs: [
    '211170114',
    '031101143',
    '211070175',
    '241070417',
    '011401533',
    '036076150',
    '021313103',
    '011500120',
  ],
};

export default bank;
