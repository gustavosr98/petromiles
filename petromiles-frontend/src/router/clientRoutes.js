const clientRoutesRaw = Object.freeze({
  LOGIN: {
    path: "/",
    name: "ClientLogin",
    component: () =>
      import(
        /* webpackChunkName: "client-login" */ "@/views/Client/Login/ClientLogin.view.vue"
      ),
    meta: {
      clientGuest: true,
    },
  },
  SIGN_UP: {
    path: "/sign-up",
    name: "ClientSignUp",
    component: () =>
      import(
        /* webpackChunkName: "client-sign-up" */ "@/views/Client/Login/SignUp.view.vue"
      ),
    meta: {
      clientGuest: true,
    },
  },
  RECOVER_PASSWORD: {
    path: "/recover-password",
    name: "ClientRecoverPassword",
    component: () =>
      import(
        /* webpackChunkName: "client-recover-password" */ "@/views/Client/Login/RecoverPassword.view.vue"
      ),
    meta: {
      clientGuest: true,
    },
  },
  DASHBOARD: {
    path: "/dashboard",
    name: "ClientDashboard",
    component: () =>
      import(
        /* webpackChunkName: "client-dashboard" */ "@/views/Client/Dashboard/ClientDashboard.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  },
  PROFILE: {
    path: "/profile",
    name: "ClientProfile",
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "@/views/Client/Profile/ClientProfile.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  },
  BANK_ACCOUNT_LIST: {
    path: "/bank-accounts",
    name: "ClientBankAccountList",
    component: () =>
      import(
        /* webpackChunkName: "client-bank-account-list" */ "@/views/Client/BankAccounts/ClientBankAccountList.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  },

  TRANSACTION_LIST: {
    path: "/transactions",
    name: "ClientTransactionList",
    component: () =>
      import(
        /* webpackChunkName: "client-transaction-list" */ "@/views/Client/Transactions/ClientTransactionList.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  },
  TRANSACTION_DETAILS: {
    path: "/transaction-details/:id",
    name: "TransactionDetails",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "client-transaction-details" */ "@/views/Client/Transactions/ClientTransactionDetails.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  },
  BUY_POINTS: {
    path: "/buy-points",
    name: "ClientBuyPoints",
    component: () =>
      import(
        /* webpackChunkName: "client-buy-points" */ "@/views/Client/Payments/ClientBuyPoints.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  },
  SELL_POINTS: {
    path: "/sell-points",
    name: "ClientSellPoints",
    component: () =>
      import(
        /* webpackChunkName: "client-sell-points" */ "@/views/Client/Withdrawals/ClientSellPoints.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  },
  SUBSCRIPTION: {
    path: "/user-subscription",
    name: "UserSubscription",
    component: () =>
      import(
        /* webpackChunkName: "subscription" */ "@/views/Client/Subscription/Subscription.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  }, 
  SUSCRIPTION_PURCHASE: {
    path: "/user-subscription-purchase",
    name: "UserSubscriptionPurchase",
    component: () =>
      import(
        /* webpackChunkName: "subscription-purchase" */ "@/views/Client/Subscription/PurchaseSubscription/PurchaseSubscription.view"
      ),
    meta: {
      requiresClientAuth: true,
    },
  },  
});

// To be used in Vue Router
const clientRoutesArray = Object.keys(clientRoutesRaw).map(
  cr => clientRoutesRaw[cr]
);

// To be used inside componentes
let clientRoutes = {};
Object.keys(clientRoutesRaw).map(
  cr =>
    (clientRoutes[cr] = {
      ...clientRoutesRaw[cr],
      component: null,
    })
);

export { clientRoutes as default, clientRoutesArray };
