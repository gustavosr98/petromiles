<template>
  <v-content>
    <navbar :navigationModules="navigationModules"></navbar>
    <slot></slot>
  </v-content>
</template>

<script>
import Navbar from "@/components/Navbar";
import adminRoutes from "@/router/adminRoutes";

export default {
  name: "admin-layout",
  components: {
    navbar: Navbar,
  },
  data() {
    return {
      navigationModules: [
        {
          name: this.$tc("navbar.dashboard"),
          mdiIcon: "mdi-home",
          route: adminRoutes.DASHBOARD,
        },
        {
          name: this.$tc("navbar.user"),
          mdiIcon: "mdi-account-multiple",
          route: adminRoutes.USER_LIST,
        },
        {
          name: this.$tc("navbar.bankAccount"),
          mdiIcon: "mdi-bank",
          route: adminRoutes.BANK_ACCOUNT_LIST,
        },
        {
          name: this.$tc("navbar.transaction"),
          mdiIcon: "mdi-repeat",
          route: adminRoutes.TRANSACTION_LIST,
        },
        {
          name: this.$tc("navbar.platformConfig"),
          mdiIcon: "mdi-settings",
          route: adminRoutes.PLATFORM_CONFIG,
        },
      ],
    };
  },
};
</script>
