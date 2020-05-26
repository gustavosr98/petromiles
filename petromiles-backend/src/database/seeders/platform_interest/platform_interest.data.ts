/* eslint-disable @typescript-eslint/camelcase */

// Para plan GOLD, los puntos extra se denotan por el campo amount
// 2500 puntos = 5$, 5$ = 500 cents
export const PLATAFORM_INTERESTS = [
  {
    idPlatformInterest: 1,
    name: 'PREMIUM_EXTRA',
    percentage: '0.20',
  },
  {
    idPlatformInterest: 2,
    name: 'GOLD_EXTRA',
    percentage: '0.2',
    amount: '500',
  },
  {
    idPlatformInterest: 3,
    name: 'VERIFICATION',
    amount: '250',
  },

  {
    idPlatformInterest: 4,
    name: 'BUY',
    percentage: '0.015',
  },

  {
    idPlatformInterest: 5,
    name: 'WITHDRAWAL',
    percentage: '0.05',
  },
];
