<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="9">
        <v-card class="elevation-12">
          <v-window>
            <auth-window title="Welcome back" msg="Nice to see you again">
              <login-form
                title="Login with your administrator account"
                :showClientElement="false"
                :recoverRoute="recoverRoute"
                :dashboardRoute="dashboardRoute"
                :role="role"
              />
            </auth-window>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthWindow from "@/components/Auth/AuthWindow";
import LoginForm from "@/components/Auth/LoginForm";

import adminRoutes from "@/router/adminRoutes";

import authConstants from "@/constants/authConstants";

export default {
  name: "admin-login",
  components: {
    "auth-window": AuthWindow,
    "login-form": LoginForm,
  },
  data() {
    return {
      dashboardRoute: adminRoutes.DASHBOARD.name,
      recoverRoute: adminRoutes.RECOVER_PASSWORD.name,
      role: authConstants.ADMINISTRATOR,
    };
  },
};
</script>

<style lang="scss" scoped></style>
