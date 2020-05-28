declare namespace App {
  namespace Auth {
    interface UserClient {
      user: import('../src/modules/user/user-client/user-client.entity').UserClient;
      userDetails: import('../src/modules/user/user-details/user-details.entity').UserDetails;
      role: import('../src/modules/management/role/role.enum').Role;
    }

    interface JWTPayload {
      email: string;
      role: import('../src/modules/management/role/role.enum').Role;
    }

    interface Response {
      email: string;
      userDetails: object;
      token: string;
      role: import('../src/modules/management/role/role.enum').Role;
      id: number;
    }

    interface LoginRequest {
      email: string;
      password?: string;
      role: import('../src/modules/management/role/role.enum').Role;
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
      transaction?: import('../src/modules/transaction/transaction/transaction.entity').Transaction;
      rawAmount: number;
      type: import('../src/modules/transaction/transaction/transaction.enum').TransactionType;
      pointsConversion: import('../src/modules/management/points-conversion/points-conversion.entity').PointsConversion;
      clientBankAccount: import('../src/modules/bank-account/client-bank-account/client-bank-account.entity').ClientBankAccount;
      thirdPartyInterest?: import('../src/modules/management/third-party-interest/third-party-interest.entity').ThirdPartyInterest;
      platformInterest: import('../src/modules/management/platform-interest/platform-interest.entity').PlatformInterest;
      stateTransactionDescription: string;
      promotion?: import('../src/modules/management/promotion/promotion.entity').Promotion;
      platformInterestExtraPoints?: import('../src/modules/management/platform-interest/platform-interest.entity').PlatformInterest;
      operation?: number;
      paymentProviderTransactionId?: string;
    }
    interface TransactionInterests {
      platformInterestType: import('../src/modules/management/platform-interest/platform-interest.enum').PlatformInterest;
      platformInterestExtraPointsType: import('../src/modules/management/platform-interest/platform-interest.enum').PlatformInterest;
      thirdPartyInterestType: import('./../src/modules/payment-provider/payment-provider.enum').PaymentProvider;
    }
  }
}
