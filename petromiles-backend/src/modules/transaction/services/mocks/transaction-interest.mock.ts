export const expectedThirdPartyInterest = {
  idThirdPartyInterest: 1,
  name: 'Transaction Interest',
  transactionType: 'deposit',
  paymentProvider: 'STRIPE',
  amountDollarCents: 75,
  initialDate: '2020-08-12T00:00:00.461Z',
};

export const expectedPlatformInterest = {
  idPlatformInterest: 5,
  name: 'verification',
  amount: '250',
  initialDate: '2020-08-12T00:00:00.461Z',
  description: 'verificationInterest',
};

export const expectedTransactionInterest = {
  idTransactionInterest: 19,
  fk_platform_interest: 5,
  fk_third_party_interest: 1,
  fk_transaction: 18,
};