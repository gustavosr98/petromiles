const clientRoutesRaw = Object.freeze({
  LOGIN: {
    path: "/",
    name: "ClientLogin",
    component: () =>
      import(
        /* webpackChunkName: "client-login" */ "@/modules/Auth/views/Login.vue"
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
        /* webpackChunkName: "client-sign-up" */ "@/modules/Auth/views/SignUp.vue"
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
        /* webpackChunkName: "client-dashboard" */ "@/modules/Client/views/ClientDashboard"
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
        /* webpackChunkName: "profile" */ "@/modules/Client/views/ClientProfile"
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
        /* webpackChunkName: "client-bank-account-list" */ "@/modules/Client/views/ClientBankAccountList"
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
        /* webpackChunkName: "client-transaction-list" */ "@/modules/Client/views/ClientTransactionList"
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
        /* webpackChunkName: "client-buy-points" */ "@/modules/Client/views/ClientBuyPoints"
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
        /* webpackChunkName: "client-sell-points" */ "@/modules/Client/views/ClientSellPoints"
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
