/* eslint-disable @typescript-eslint/camelcase */
import { State } from '../../../modules/management/state/state.entity';

/* MONEY IS REPRESENTED IN CENTS, 25$ = 2500 cents*/

export const SUSCRIPTIONS = [
  {
    id_suscription: 1,
    name: 'BASIC',
    cost: 0,
    description: 'Suscription initial of every new client',
  },

  {
    id_suscription: 2,
    name: 'PREMIUM',
    cost: 2500,
    description: 'User must to ask for this suscription',
  },
  {
    id_suscription: 3,
    name: 'GOLD',
    cost: 0,
    upgraded_amount: 15000,
    description:
      'This suscription is active when the user has spend an amount greater or equal to upgraded_amount',
  },
];
