import {
  stateUser,
  userDetails,
  userSuscription,
  bankAccount,
  stateBankAccount,
  verifyingState,
} from '@/modules/bank-account/services/mocks/client-bank-account.mock';

export const expectedStateVerificationTransaction = {
  idStateTransaccion: 25,
  initialDate: '2020-08-11T22:07:58.461Z',
  finalDate: null,
  description: 'VERIFICATION_TRANSACTION_CREATION',
  fk_state: 2,
  fk_transaction: 18,
};

export const expectedStateValidTransaction = {
  idStateTransaccion: 26,
  initialDate: '2020-08-11T23:07:58.461Z',
  finalDate: null,
  description: 'CHANGE_VERIFICATION_TO_VALID',
  fk_state: 5,
  fk_transaction: 18,
};

export const expectedBankAccountVerificationTransaction  = {
  idTransaction: 18,
  idUserClient: 1,
  initialDate: '2020-08-11T120:50:44.452Z',
  rawAmount: '0.000',
  totalAmountWithInterest: '100.000',
  type: 'bankAccountValidation',
  operation: null,
  paymentProviderTransactionId: null,
  stateTransaction: [
    {
      idStateTransaction: 23,
      initialDate: '2020-08-11T120:54:44.452Z',
      finalDate: null,
      description: 'VERIFICATION_TRANSACTION_CREATION',
      verifyingState,
    },
  ],
  transactionInterest: [
    {
      idTransactionInterest: 13,
      platformInterest: {
        idPlatformInterest: 3,
        name: 'verification',
        amount: '250',
        percentage: null,
        points: null,
        initialDate: '2020-08-11T121:00:00.452Z',
        finalDate: null,
        description: 'verificationInterest',
        suscription: null,
      },
      platformInterestExtraPoints: null,
      thirdPartyInterest: {
        idThirdPartyInterest: 1,
        name: 'Transaction Interest',
        transactionType: 'deposit',
        paymentProvider: 'STRIPE',
        amountDollarCents: 75,
        percentage: null,
        initialDate: '2020-08-11T121:00:00.452Z',
        finalDate: null,
      },
    },
  ],
  pointsConversion: {
    idPointsConversion: 1,
    onePointEqualsDollars: '0.00200000000000',
    initialDate: '2020-08-11T121:00:00.452Z',
    finalDate: null,
  },
  clientBankAccount: {
    idClientBankAccount: 4,
    paymentProvider: 'STRIPE',
    chargeId: 'ba_1HEMPXDfwU0tej1wFdSxNpOM',
    primary: false,
    transferId: 'ba_1HEMPZJPZXGZidTbmwSHMvOB',
    userClient: [
      {
        idUserClient: 1,
        salt: '$2b$10$yWGg/CN1MIr.kWNeeKDDDO',
        googleToken: null,
        facebookToken: null,
        email: 'test@petromiles.com',
        password:
          '$2b$10$yWGg/CN1MIr.kWNeeKDDDO3W9aq2g0K/d1JOG8iPTrIokXtUEDze2',
        stateUser,
        userDetails,
        userSuscription,
      },
    ],
    bankAccount: [bankAccount],
    stateBankAccount: [stateBankAccount],
  },
  fk_client_on_third_party: null,
};

export const expectedBankAccountTransaction ={
  idTransaction: 18,
  idUserClient: 1,
  initialDate: '2020-08-12T04:09:46.769Z',
  rawAmount: '0.000',
  totalAmountWithInterest: '100.000',
  type: 'bankAccountValidation',
  operation: null,
  paymentProviderTransactionId: null,
  fk_transaction: null,
  fk_points_conversion: 1,
  fk_client_bank_account: 4,
  fk_client_on_third_party: null,
};