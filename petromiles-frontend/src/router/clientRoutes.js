const clientRoutesRaw = Object.freeze({
  LOGIN: {
    path: "/",
    name: "ClientLogin",
    component: () =>
      import(
        /* webpackChunkName: "client-login" */ "@/modules/Auth/views/Login.vue"
      ),
  },
  SIGN_UP: {
    path: "/sign-up",
    name: "ClientSignUp",
    component: () =>
      import(
        /* webpackChunkName: "client-sign-up" */ "@/modules/Auth/views/SignUp.vue"
      ),
  },
  DASHBOARD: {
    path: "/dashboard",
    name: "ClientDashboard",
    component: () =>
      import(
        /* webpackChunkName: "client-dashboard" */ "@/modules/Client/views/ClientDashboard"
      ),
  },
  PROFILE: {
    path: "/profile",
    name: "ClientProfile",
    component: () =>
      import(
        /* webpackChunkName: "profile" */ "@/modules/Client/views/ClientProfile"
      ),
  },
  BANK_ACCOUNT_LIST: {
    path: "/bank-accounts",
    name: "ClientBankAccountList",
    component: () =>
      import(
        /* webpackChunkName: "client-bank-account-list" */ "@/modules/Client/views/ClientBankAccountList"
      ),
  },
  TRANSACTION_LIST: {
    path: "/transactions",
    name: "ClientTransactionList",
    component: () =>
      import(
        /* webpackChunkName: "client-transaction-list" */ "@/modules/Client/views/ClientTransactionList"
      ),
  },
  BUY_POINTS: {
    path: "/buy-points",
    name: "ClientBuyPoints",
    component: () =>
      import(
        /* webpackChunkName: "client-buy-points" */ "@/modules/Client/views/ClientBuyPoints"
      ),
  },
  SELL_POINTS: {
    path: "/sell-points",
    name: "ClientSellPoints",
    component: () =>
      import(
        /* webpackChunkName: "client-sell-points" */ "@/modules/Client/views/ClientSellPoints"
      ),
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
