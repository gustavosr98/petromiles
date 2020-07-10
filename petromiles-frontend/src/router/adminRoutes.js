const adminRoutesRaw = Object.freeze({
  LOGIN: {
    path: "/admin/",
    name: "AdminLogin",
    component: () =>
      import(
        /* webpackChunkName: "admin-login" */ "@/views/Admin/Login/AdminLogin.view"
      ),
    meta: {
      adminGuest: true,
    },
  },
  RECOVER_PASSWORD: {
    path: "/admin/recover-password",
    name: "AdminRecoverPassword",
    component: () =>
      import(
        /* webpackChunkName: "admin-recover-password" */ "@/views/Admin/Login/RecoverPassword.view.vue"
      ),
    meta: {
      adminGuest: true,
    },
  },
  DASHBOARD: {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: () =>
      import(
        /* webpackChunkName: "admin-dashboard" */ "@/views/Admin/Dashboard/AdminDashboard.view"
      ),
    meta: {
      requiresAdminAuth: true,
    },
  },
  USER_LIST: {
    path: "/admin/users",
    name: "AdminUserList",
    component: () =>
      import(
        /* webpackChunkName: "admin-user-list" */ "@/views/Admin/Users/AdminUserList.view"
      ),
    meta: {
      requiresAdminAuth: true,
    },
  },
  USER_DETAILS: {
    path: "/admin/users/detail",
    name: "AdminUsersDetail",
    component: () =>
      import(
        /* webpackChunkName: "admin-user-list" */ "@/views/Admin/Users/ClientDetails.view"
      ),
    meta: {
      requiresAdminAuth: true,
    },
    props: true,
  },
  PLATFORM_CONFIG: {
    path: "/admin/platform-config",
    name: "AdminPlatformConfig",
    component: () =>
      import(
        /* webpackChunkName: "admin-platform-config" */ "@/views/Admin/PlatformConfiguration/AdminPlatformConfig.view"
      ),
    meta: {
      requiresAdminAuth: true,
    },
  },
  BANK_ACCOUNT_LIST: {
    path: "/admin/bank-accounts",
    name: "AdminBankAccountList",
    component: () =>
      import(
        /* webpackChunkName: "admin-bank-account-list" */ "@/views/Admin/BankAccounts/AdminBankAccountList.view"
      ),
    meta: {
      requiresAdminAuth: true,
    },
  },
  TRANSACTION_LIST: {
    path: "/admin/transactions",
    name: "AdminTransactionList",
    component: () =>
      import(
        /* webpackChunkName: "admin-transaction-list" */ "@/views/Admin/Transactions/AdminTransactionList.view"
      ),
    meta: {
      requiresAdminAuth: true,
    },
  },
  PARTNERS_INFO: {
    path: "/admin/partners",
    name: "PartnersInfo",
    component: () =>
      import(
        /* webpackChunkName: "partners-info" */ "@/views/Admin/ThirdPartyClients/PartnersInfo.view"
      ),
    meta: {
      requiresAdminAuth: true,
    },
  },
  CREATE_ADMIN: {
    path: "/admin/create-admin",
    name: "CreateAdmin",
    component: () =>
      import(
        /* webpackChunkName: "create-admin" */ "@/views/Admin/CreateAdmin/CreateAdmin.view"
      ),
    meta: {
      requiresAdminAuth: true,
    },
  },
});

// To be used in Vue Router
const adminRoutesArray = Object.keys(adminRoutesRaw).map(
  cr => adminRoutesRaw[cr]
);

// To be used inside componentes
let adminRoutes = {};
Object.keys(adminRoutesRaw).map(
  cr =>
    (adminRoutes[cr] = {
      ...adminRoutesRaw[cr],
      component: null,
    })
);

export { adminRoutes as default, adminRoutesArray };
