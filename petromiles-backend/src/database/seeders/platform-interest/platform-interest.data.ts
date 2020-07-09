/* eslint-disable @typescript-eslint/camelcase */

// Para plan GOLD, los puntos extra se denotan por el campo amount
// 2500 puntos = 5$, 5$ = 500 cents
export const PLATAFORM_INTERESTS = [
  {
    idPlatformInterest: 1,
    name: 'premium',
    percentage: '0.20',
    description: 'premiumInterest',
  },
  {
    idPlatformInterest: 2,
    name: 'gold',
    percentage: '0.2',
    points: 2500,
    description: 'goldInterest',
  },
  {
    idPlatformInterest: 3,
    name: 'verification',
    amount: '250',
    description: 'verificationInterest',
  },

  {
    idPlatformInterest: 4,
    name: 'buy',
    percentage: '0.015',
    description: 'buyInterest',
  },

  {
    idPlatformInterest: 5,
    name: 'withdrawal',
    percentage: '0.05',
    description: 'withdrawalInterest',
  },
];
