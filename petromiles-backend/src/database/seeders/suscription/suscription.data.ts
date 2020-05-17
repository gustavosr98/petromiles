/* eslint-disable @typescript-eslint/camelcase */

/* MONEY IS REPRESENTED IN CENTS, $25 = 2500 cents*/
import { Suscription } from './../../../modules/suscription/suscription.enum';

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
    description: 'User must to ask for this suscription',
  },
  {
    idSuscription: 3,
    name: Suscription.GOLD,
    cost: 0,
    upgraded_amount: 15000,
    description:
      'This suscription is active when the user has spend an amount greater or equal to upgraded_amount',
  },
];
