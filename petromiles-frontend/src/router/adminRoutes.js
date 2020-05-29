const adminRoutesRaw = Object.freeze({
  LOGIN: {
    path: "/admin/",
    name: "AdminLogin",
    component: () =>
      import(
        /* webpackChunkName: "admin-login" */ "@/modules/Admin/views/AdminLogin.vue"
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
        /* webpackChunkName: "admin-dashboard" */ "@/modules/Admin/views/AdminDashboard"
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
        /* webpackChunkName: "admin-user-list" */ "@/modules/User/views/AdminUserList"
      ),
    meta: {
      requiresAdminAuth: true,
    },
  },
  PLATFORM_CONFIG: {
    path: "/admin/platform-config",
    name: "AdminPlatformConfig",
    component: () =>
      import(
        /* webpackChunkName: "admin-platform-config" */ "@/modules/Admin/views/AdminPlatformConfig"
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
        /* webpackChunkName: "admin-bank-account-list" */ "@/modules/Admin/views/AdminBankAccountList"
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
        /* webpackChunkName: "admin-transaction-list" */ "@/modules/Admin/views/AdminTransactionList"
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
