declare namespace App {
  namespace Auth {
    interface UserClient {
      user: import('../src/entities/user-client.entity').UserClient;
      userDetails: import('../src/entities/user-details.entity').UserDetails;
      role: import('../src/enums/role.enum').Role;
    }

    interface UserAdministrator {
      userAdmin: import('../src/entities/user-administrator.entity').UserAdministrator;
      userDetails: import('../src/entities/user-details.entity').UserDetails;
      role: import('../src/enums/role.enum').Role;
    }

    interface JWTPayload {
      email: string;
      role: import('../src/enums/role.enum').Role;
    }

    interface Response {
      email: string;
      userDetails: object;
      token: string;
      role: import('../src/enums/role.enum').Role;
      id: number;
      federated: boolean;
    }

    interface ResponseAdministrator {
      email: string;
      password: string;
      userDetails: object;
      role: import('../src/enums/role.enum').Role;
      id: number;
    }

    interface ResponseStripe {
      object: string;
      account_holder_name: string;
      bank_name: string;
      country: string;
      currency: string;
      accountNumber_last4: string;
      metadata: object;
      status: string;
    }

    interface LoginRequest {
      email: string;
      password?: string;
      role: import('../src/enums/role.enum').Role;
    }
  }

  namespace BankAccount {
    interface validate {
      validateRoutingNumber(routingNumber: number): boolean;
    }
  }

  namespace Transaction {
    interface TransactionCreation {
      totalAmountWithInterest: number;
      transaction?: import('../src/entities/transaction.entity').Transaction;
      rawAmount: number;
      type: import('../src/enums/transaction.enum').TransactionType;
      pointsConversion: import('../src/entities/points-conversion.entity').PointsConversion;
      clientBankAccount?: import('../src/entities/client-bank-account.entity').ClientBankAccount;
      clientOnThirdParty?: import('../src/entities/client-on-third-party.entity').ClientOnThirdParty;
      thirdPartyInterest?: import('../src/entities/third-party-interest.entity').ThirdPartyInterest;
      platformInterest: import('../src/entities/platform-interest.entity').PlatformInterest;
      stateTransactionDescription: string;
      promotion?: import('../src/entities/promotion.entity').Promotion;
      platformInterestExtraPoints?: import('../src/entities/platform-interest.entity').PlatformInterest;
      operation?: number;
      paymentProviderTransactionId?: string;
    }
    interface TransactionInterests {
      platformInterestType: import('../src/enums/platform-interest.enum').PlatformInterest;
      platformInterestExtraPointsType: import('../src/enums/platform-interest.enum').PlatformInterest;
      thirdPartyInterestType: import('../src/enums/payment-provider.enum').PaymentProvider;
      type: import('../src/enums/transaction.enum').TransactionType;
    }

    interface TransactionDetails {
      id: number;
      date: string;
      type: import('../src/enums/transaction.enum').TransactionType;
      bankAccount: string;
      state: string;
      amount: number;
      interest: number;
      pointsEquivalent?: number;
      pointsConversion: number;
      total: number;
      clientBankAccountEmail?: string;
    }
  }

  interface Statistics {
    transactions: {
      addPoints: {
        totalInvalid: number;
        totalValid: number;
        totalPending: number;
        total: number;
      };
      exchangePoints: {
        totalInvalid: number;
        totalValid: number;
        totalPending: number;
        total: number;
      };
      thirdPartyClient: {
        totalInvalid: number;
        totalValid: number;
        totalPending: number;
        total: number;
      };
      total: number;
    };
    clientBankAccounts: {
      totalInvalid: number;
      totalValid: number;
      totalPending: number;
      total: number;
    };
    users?: {
      clients: {
        totalBlocked: number;
        totalActive: number;
        totalClients: number;
      };
      admins: {
        totalBlocked: number;
        totalActive: number;
        totalAdmins: number;
      };
    };
  }
}
