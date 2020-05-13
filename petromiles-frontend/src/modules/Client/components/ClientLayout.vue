<template>
  <v-content>
    <navbar :navigationModules="navigationModules"></navbar>
    <slot></slot>
  </v-content>
</template>

<script>
import Navbar from "@/components/Navbar";
import clientRoutes from "@/router/clientRoutes";

export default {
  name: "client-layout",
  components: {
    navbar: Navbar,
  },
  data() {
    return {
      navigationModules: [
        {
          name: this.$tc("navbar.dashboard"),
          mdiIcon: "mdi-home",
          route: clientRoutes.DASHBOARD,
        },

        {
          name: this.$tc("navbar.bankAccount"),
          mdiIcon: "mdi-bank",
          route: clientRoutes.BANK_ACCOUNT_LIST,
        },
        {
          name: this.$tc("navbar.transaction"),
          mdiIcon: "mdi-repeat",
          route: clientRoutes.TRANSACTION_LIST,
        },
        {
          name: this.$tc("navbar.addPoints"),
          mdiIcon: "mdi-coins",
          route: clientRoutes.BUY_POINTS,
        },
        {
          name: this.$tc("navbar.exchangePoints"),
          mdiIcon: "mdi-cash-refund",
          route: clientRoutes.SELL_POINTS,
        },
        {
          name: this.$tc("navbar.profile"),
          mdiIcon: "mdi-account-circle",
          route: clientRoutes.PROFILE,
        },
      ],
    };
  },
};
</script>
