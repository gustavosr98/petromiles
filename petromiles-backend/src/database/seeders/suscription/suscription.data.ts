/* eslint-disable @typescript-eslint/camelcase */

/* MONEY IS REPRESENTED IN CENTS, $25 = 2500 cents*/
import { Suscription } from '@/enums/suscription.enum';

export const SUSCRIPTIONS = [
  {
    idSuscription: 1,
    name: Suscription.BASIC,
    cost: 0,
    description: 'Suscription initial of every new client',
  },

  {
    idSuscription: 2,
    name: Suscription.PREMIUM,
    cost: 2500,
    description: 'premiumConditionals',
  },
  {
    idSuscription: 3,
    name: Suscription.GOLD,
    cost: 0,
    upgradedAmount: 15000,
    description: 'goldConditionals',
  },
];
