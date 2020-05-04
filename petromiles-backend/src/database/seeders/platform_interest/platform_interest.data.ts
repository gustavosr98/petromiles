/* eslint-disable @typescript-eslint/camelcase */

// Para plan GOLD, los puntos extra se denotan por el campo amount
// 2500 puntos = 5$, 5$ = 500 cents
export const PLATAFORM_INTERESTS = [
  {
    id_platform_interest: 1,
    name: 'Premium Extra',
    percentage: 20,
  },
  {
    id_platform_interest: 2,
    name: 'Gold Extra',
    percentage: 20,
    amount: 5000,
  },
  {
    id_platform_interest: 3,
    name: 'Verification Interest',
    amount: 250,
  },

  {
    id_platform_interest: 4,
    name: 'Buy Interest',
    percentage: 1.5,
  },

  {
    id_platform_interest: 5,
    name: 'Withdrawal Interest',
    percentage: 5,
  },
];
