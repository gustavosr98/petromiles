import { Bank } from '@/enums/bank.enum';

const bank: {
  bankName: Bank;
  achs: string[];
} = {
  bankName: Bank.BBVA_COMPASS,
  achs: [
    '062001186',
    '122105744',
    '321170538',
    '107005319',
    '063013924',
    '107000783',
    '113010547',
  ],
};

export default bank;
