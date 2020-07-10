<template>
  <v-main>
    <navbar :navigationModules="navigationModules" :isAdmin="true"></navbar>
    <slot></slot>
  </v-main>
</template>

<script>
import Navbar from "@/components/General/Navigation/Navbar";
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
          name: "navbar.dashboard",
          mdiIcon: "mdi-home",
          route: adminRoutes.DASHBOARD,
        },
        {
          name: "navbar.user",
          mdiIcon: "mdi-account-multiple",
          route: adminRoutes.USER_LIST,
        },        
        {
          name: "navbar.transaction",
          mdiIcon: "mdi-repeat",
          route: adminRoutes.TRANSACTION_LIST,
        },
        {
          name: "navbar.platformConfig",
          mdiIcon: "mdi-settings",
          route: adminRoutes.PLATFORM_CONFIG,
        },
        {
          name: "navbar.partners",
          mdiIcon: "how_to_reg",
          route: adminRoutes.PARTNERS_INFO,
        },
        {
          name: "navbar.createAdmin",
          mdiIcon: "add_circle",
          route: adminRoutes.CREATE_ADMIN,
        },
      ],
    };
  },
};
</script>
