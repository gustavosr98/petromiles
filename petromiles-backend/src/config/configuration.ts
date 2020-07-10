import Stripe from 'stripe';

const databaseSSL = () => {
  if (process.env.DATABASE_SSL_ON === 'true')
    return {
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  else return null;
};

export default () => ({
  api: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    database: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    synchronize: process.env.DATABASE_SYNCHRONIZE,
    ...databaseSSL(),
  },
  paymentProvider: {
    stripe: {
      secretKey: <string>process.env.STRIPE_SECRET_KEY,
      publicKey: <string>process.env.STRIPE_PUBLIC_KEY,
      config: <Stripe.StripeConfig>{
        apiVersion: process.env.STRIPE_API_VERSION,
      },
    },
  },
  lang: {
    poeditor: {
      apiSecretKey: process.env.POEDITOR_API_KEY,
      projectId: process.env.POEDITOR_PROJECT_ID,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    name: process.env.JWT_NAME,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  mails: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      emailFrom: process.env.SENDGRID_FROM,
      templates: {
        welcome: process.env.SENDGRID_WELCOME_TEMPLATE,
        invoice: {
          english: process.env.SENDGRID_WELCOME_INVOICE_EN_TEMPLATE,
          spanish: process.env.SENDGRID_WELCOME_INVOICE_ES_TEMPLATE,
        },
        upgradeToGold: {
          english: process.env.SENDGRID_UPGRADE_TO_GOLD_EN_TEMPLATE,
          spanish: process.env.SENDGRID_UPGRADE_TO_GOLD_ES_TEMPLATE,
        },
        bankAccountRegistration: {
          english: process.env.SENDGRID_BANK_REGISTRATION_EN_TEMPLATE,
          spanish: process.env.SENDGRID_BANK_REGISTRATION_ES_TEMPLATE,
        },
        bankAccountVerified: {
          english: process.env.SENDGRID_BANK_VERIFIED_EN_TEMPLATE,
          spanish: process.env.SENDGRID_BANK_VERIFIED_ES_TEMPLATE,
        },
        bankAccountDeletion: {
          english: process.env.SENDGRID_BANK_DELETION_EN_TEMPLATE,
          spanish: process.env.SENDGRID_BANK_DELETION_ES_TEMPLATE,
        },
        successfulPointsPayment: {
          english: process.env.SENDGRID_SUCCESSFUL_POINTS_PAYMENT_EN_TEMPLATE,
          spanish: process.env.SENDGRID_SUCCESSFUL_POINTS_PAYMENT_ES_TEMPLATE,
        },
        failedPointsPayment: {
          english: process.env.SENDGRID_FAILED_POINTS_PAYMENT_EN_TEMPLATE,
          spanish: process.env.SENDGRID_FAILED_POINTS_PAYMENT_ES_TEMPLATE,
        },
        withdrawal: {
          english: process.env.SENDGRID_WITHDRAWAL_EN_TEMPLATE,
          spanish: process.env.SENDGRID_WITHDRAWAL_ES_TEMPLATE,
        },
        recover: {
          english: process.env.SENDGRID_RECOVER_EN_TEMPLATE,
          spanish: process.env.SENDGRID_RECOVER_ES_TEMPLATE,
        },
        sendVerificationCodeEmail: {
          english: process.env.SENDGRID_VERIFICATION_CODE_EN_TEMPLATE,
          spanish: process.env.SENDGRID_VERIFICATION_CODE_ES_TEMPLATE,
        },
        customerPointsAccumulationApproval: {
          english: process.env.SENDGRID_POINTS_ACCUMULATION_APPROVAL_EN_TEMPLATE,
          spanish: process.env.SENDGRID_POINTS_ACCUMULATION_APPROVAL_ES_TEMPLATE,
        },
        customerPointsAccumulationRejection: {
          english: process.env.SENDGRID_POINTS_ACCUMULATION_REJECTION_EN_TEMPLATE,
          spanish: process.env.SENDGRID_POINTS_ACCUMULATION_REJECTION_ES_TEMPLATE,
        },
      },
    },
  },
});
