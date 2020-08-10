// --- Common
export const userSuscription = [
  {
    idUserSuscription: 1,
    initialDate: '2020-08-08T01:07:29.940Z',
    upgradedAmount: 0,
    finalDate: null,
    suscription: {
      idSuscription: 1,
      name: 'BASIC',
      cost: 0,
      upgradedAmount: null,
      description: 'Suscription initial of every new client',
    },
  },
];
export const state = {
  idState: 1,
  name: 'active',
  description: 'This state indicates that the object is ready to be used',
};
export const verifyingState = {
  idState: 2,
  name: 'verifying',
  description:
    'This state indicates that the object is in the verification process',
};

export const blockedState = {
  idState: 3,
  name: 'blocked',
  description: 'This state indicates that the object is blocked',
};

export const language = { idLanguage: 1, name: 'english', shortname: 'en' };
export const userDetails = {
  idUserDetails: 6,
  firstName: 'petro',
  middleName: null,
  lastName: 'miles',
  secondLastName: null,
  birthdate: null,
  address: null,
  phone: '12345',
  photo: null,
  customerId: null,
  accountId: null,
  userClient: null,
  language,
};
export const bank = {
  idBank: 1,
  name: 'Bank of America',
  photo:
    'https://firebasestorage.googleapis.com/v0/b/petromiles-f04cc.appspot.com/o/banks%2FBank%20of%20America.png?alt=media&token=84f6581d-cffe-47e7-a846-0b185460cc44',
  country: { idCountry: 1, name: 'UNITED STATES' },
};
export const routingNumber = {
  idRoutingNumber: 1,
  number: '124003116',
  bank,
};
export const bankAccount = {
  idBankAccount: 3,
  accountNumber: '000123456789',
  checkNumber: '1234',
  nickname: 'test 5',
  type: 'Saving',
  routingNumber,
};
export const stateBankAccount = [
  {
    idStateBankAccount: 7,
    initialDate: '2020-08-09T20:06:28.639Z',
    finalDate: null,
    description: 'NEWLY_CREATED_ACCOUNT',
    state: [state],
  },
];
export const stateUser = [
  {
    idStateUser: 2,
    initialDate: '2020-08-08T01:07:29.899Z',
    finalDate: null,
    description: null,
    state,
  },
];

export const expectedBankAccount = {
  accountNumber: '000123456789',
  checkNumber: '1234',
  nickname: 'test',
  type: 'Checking',
  userDetails,
  routingNumber,
  idBankAccount: 4,
};
export const createBankAccountDTO = {
  routingNumber: '121000358',
  type: 'Checking',
  accountNumber: '000123456789',
  checkNumber: '1234',
  nickname: 'test 9',
  bank,
  userDetails: {
    firstName: 'petro',
    lastName: 'miles',
    email: 'test@petromiles.com',
    phone: '123456',
  },
};
export const expectedChangeBankAccount = {
  clientBankAccount: {
    bankAccount,
    userClient: {
      idUserClient: 1,
      salt: '$2b$10$p3OjA33PAfndN9rC1LBlfe',
      googleToken: null,
      facebookToken: null,
      email: 'test@petromiles.com',
      password: '$2b$10$p3OjA33PAfndN9rC1LBlfeG3dKutdB1eY4odnyfbzUGKVmVY4JFqO',
      stateUser,
      userDetails,
      userSuscription,
    },
    transferId: 'ba_1HDsZkAT8OF6QY3PkYrXsXOW',
    chargeId: 'ba_1HDsZiDfwU0tej1wIaM46rN4',
    paymentProvider: 'STRIPE',
    primary: false,
    idClientBankAccount: 2,
  },
  description: 'NEWLY_CREATED_ACCOUNT',
  state,
  finalDate: null,
  idStateBankAccount: 2,
  initialDate: '2020-08-08T13:59:09.927Z',
};
export const expectedClientBankAccount = {
  idClientBankAccount: 3,
  paymentProvider: 'STRIPE',
  chargeId: 'ba_1HEKmkDfwU0tej1wAWeUIPNN',
  primary: false,
  transferId: 'ba_1HEKmmJPZXGZidTbJQlcIAOw',
  userClient: {
    idUserClient: 1,
    salt: '$2b$10$yWGg/CN1MIr.kWNeeKDDDO',
    googleToken: null,
    facebookToken: null,
    email: 'test@petromiles.com',
    password: '$2b$10$yWGg/CN1MIr.kWNeeKDDDO3W9aq2g0K/d1JOG8iPTrIokXtUEDze2',
    stateUser,
    userDetails,
    userSuscription,
  },
  bankAccount,
  stateBankAccount,
};
export const expectedPaymentProviderBankAccount = {
  transferId: 'ba_1HDsZkAT8OF6QY3PkYrXsXOW',
  chargeId: 'ba_1HDsZiDfwU0tej1wIaM46rN4',
};
export const expectedUserClient = {
  idUserClient: 1,
  salt: '$2b$10$4WQNzcG4y7h864.R8X3Pxu',
  googleToken: null,
  facebookToken: null,
  email: 'alleyne.michelle333@hotmail.com',
  password: '$2b$10$4WQNzcG4y7h864.R8X3PxuV5scq/pm1RX3yPfy.j4iBtS/RUvBTn2',
  stateUser,
  userDetails,
  userSuscription,
};
export const expectedVerification = {
  id: 'ba_1HEKmkDfwU0tej1wAWeUIPNN',
  object: 'bank_account',
  account_holder_name: 'petro test',
  account_holder_type: 'individual',
  bank_name: 'BANK OF AMERICA, N.A.',
  country: 'US',
  currency: 'usd',
  customer: 'cus_Hnsx2yB7MUFfHH',
  fingerprint: 'XmVaCsMapgO19feE',
  last4: '6789',
  metadata: {},
  routing_number: '121000358',
  status: 'verified',
};
export const expectedVerificationTransactions = [
  {
    idTransaction: 8,
    initialDate: '2020-08-09T20:06:28.661Z',
    rawAmount: '0.000',
    totalAmountWithInterest: '94.000',
    type: 'bankAccountValidation',
    operation: null,
    paymentProviderTransactionId: null,
    fk_transaction: null,
    fk_points_conversion: 1,
    fk_client_bank_account: 3,
    fk_client_on_third_party: null,
    idUserClient: 1,
  },
  {
    idTransaction: 9,
    initialDate: '2020-08-09T20:06:28.676Z',
    rawAmount: '0.000',
    totalAmountWithInterest: '156.000',
    type: 'bankAccountValidation',
    operation: null,
    paymentProviderTransactionId: null,
    fk_transaction: 8,
    fk_points_conversion: 1,
    fk_client_bank_account: 3,
    fk_client_on_third_party: null,
    idUserClient: 1,
  },
];
export const expectedTransactions = [
  {
    idTransaction: 11,
    initialDate: '2020-08-09T21:50:37.383Z',
    rawAmount: '0.000',
    totalAmountWithInterest: '100.000',
    type: 'bankAccountValidation',
    operation: null,
    paymentProviderTransactionId: null,
    stateTransaction: [
      {
        idStateTransaction: 23,
        initialDate: '2020-08-09T22:14:02.854Z',
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
          initialDate: '2020-08-09T04:00:00.000Z',
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
          initialDate: '2020-08-09T04:00:00.000Z',
          finalDate: null,
        },
      },
    ],
    pointsConversion: {
      idPointsConversion: 1,
      onePointEqualsDollars: '0.00200000000000',
      initialDate: '2020-08-09T04:00:00.000Z',
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
    clientOnThirdParty: null,
  },
  {
    idTransaction: 10,
    initialDate: '2020-08-09T21:50:37.372Z',
    rawAmount: '0.000',
    totalAmountWithInterest: '150.000',
    type: 'bankAccountValidation',
    operation: null,
    paymentProviderTransactionId: null,
    stateTransaction: [
      {
        idStateTransaction: 23,
        initialDate: '2020-08-09T22:14:02.854Z',
        finalDate: null,
        description: 'VERIFICATION_TRANSACTION_CREATION',
        verifyingState,
      },
    ],
    transactionInterest: [
      {
        idTransactionInterest: 12,
        platformInterest: {
          idPlatformInterest: 3,
          name: 'verification',
          amount: '250',
          percentage: null,
          points: null,
          initialDate: '2020-08-09T04:00:00.000Z',
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
          initialDate: '2020-08-09T04:00:00.000Z',
          finalDate: null,
        },
      },
    ],
    pointsConversion: {
      idPointsConversion: 1,
      onePointEqualsDollars: '0.00200000000000',
      initialDate: '2020-08-09T04:00:00.000Z',
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
      bankAccount,
      stateBankAccount,
    },
    clientOnThirdParty: null,
  },
];
export const bankAccountWithUserDetails = {
  idBankAccount: 3,
  accountNumber: '000123456789',
  checkNumber: '1234',
  nickname: 'test 5',
  type: 'Saving',
  routingNumber,
  userDetails,
};
