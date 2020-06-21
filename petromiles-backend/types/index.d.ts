declare namespace App {
  namespace Auth {
    interface UserClient {
      user: import('../src/entities/user-client.entity').UserClient;
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

    interface LoginRequest {
      email: string;
      password?: string;
      role: import('../src/enums/role.enum').Role;
    }
  }

  namespace SendGrid {
    interface Mail {
      to: string;
      from: string;
      subject: string;
      templateId: string;
      dynamic_template_data: object;
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
      clientBankAccount: import('../src/entities/client-bank-account.entity').ClientBankAccount;
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
    }
  }
}
