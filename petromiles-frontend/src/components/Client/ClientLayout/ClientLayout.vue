<template>
  <v-main class="pt-0">
    <navbar :navigationModules="navigationModules"></navbar>
    <slot></slot>
  </v-main>
</template>

<script>
import Navbar from "@/components/General/Navigation/Navbar";
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
          name: "navbar.dashboard",
          mdiIcon: "mdi-home",
          route: clientRoutes.DASHBOARD,
        },

        {
          name: "navbar.bankAccount",
          mdiIcon: "mdi-bank",
          route: clientRoutes.BANK_ACCOUNT_LIST,
        },
        {
          name: "navbar.transaction",
          mdiIcon: "mdi-repeat",
          route: clientRoutes.TRANSACTION_LIST,
        },
        {
          name: "navbar.addPoints",
          mdiIcon: "mdi-coins",
          route: clientRoutes.BUY_POINTS,
        },
        {
          name: "navbar.exchangePoints",
          mdiIcon: "mdi-cash-refund",
          route: clientRoutes.SELL_POINTS,
        },
        {
          name: "navbar.subscriptions",
          mdiIcon: "mdi-arrow-up-bold-circle-outline",
          route: clientRoutes.SUBSCRIPTION,
        },        
        {
          name: "navbar.profile",
          mdiIcon: "mdi-account-circle",
          route: clientRoutes.PROFILE,
        },        
      ],
    };
  },
};
</script>
