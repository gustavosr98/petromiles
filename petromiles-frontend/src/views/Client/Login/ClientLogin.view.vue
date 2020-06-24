<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="9">
        <v-card class="elevation-12">
          <v-window>
            <auth-window title="Welcome back" msg="Nice to see you again">
              <login-form
                title="Or login with"
                :showClientElement="true"
                :signUpRoute="signUpRoute"
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
import authConstants from "@/constants/authConstants";
import clientRoutes from "@/router/clientRoutes";

export default {
  components: {
    "auth-window": AuthWindow,
    "login-form": LoginForm,
  },
  data() {
    return {
      signUpRoute: clientRoutes.SIGN_UP.name,
      recoverRoute: clientRoutes.RECOVER_PASSWORD.name,
      dashboardRoute: clientRoutes.DASHBOARD.name,
      role: authConstants.CLIENT,
    };
  },
};
</script>
