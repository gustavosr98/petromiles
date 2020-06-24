/* eslint-disable @typescript-eslint/camelcase */

// Para plan GOLD, los puntos extra se denotan por el campo amount
// 2500 puntos = 5$, 5$ = 500 cents
export const PLATAFORM_INTERESTS = [
  {
    idPlatformInterest: 1,
    name: 'premium',
    percentage: '0.20',
  },
  {
    idPlatformInterest: 2,
    name: 'gold',
    percentage: '0.2',
    amount: '500',
  },
  {
    idPlatformInterest: 3,
    name: 'verification',
    amount: '250',
  },

  {
    idPlatformInterest: 4,
    name: 'buy',
    percentage: '0.015',
  },

  {
    idPlatformInterest: 5,
    name: 'Withdrawal',
    percentage: '0.05',
  },
  {
    idPlatformInterest: 6,
    name: 'thirdPartyClientCommission',
    amount: '125',
  },
];
