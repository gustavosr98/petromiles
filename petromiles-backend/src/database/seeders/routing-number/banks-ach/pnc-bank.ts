import { Bank } from '@/enums/bank.enum';

const bank: {
  bankName: Bank;
  achs: string[];
} = {
  bankName: Bank.PNC_BANK,
  achs: [
    '031100089',
    '043002900',
    '071921891',
    '083009060',
    '083000108',
    '041000124',
    '031207607',
    '043000096',
    '042000398',
    '031312738',
    '031300012',
    '043300738',
    '031000053',
    '054000030',
  ],
};

export default bank;
