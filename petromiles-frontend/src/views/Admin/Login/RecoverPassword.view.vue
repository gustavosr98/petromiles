<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="9">
        <v-card class="elevation-12">
          <v-window>
            <auth-window
              title="Recover your Password"
              msg="Forgot your password?"
            >
              <recover-password
                title="Write your email"
                :showClientElement="false"
                :loginRoute="loginRoute"
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
import RecoverPassword from "@/components/Auth/RecoverPassword";
import authConstants from "@/constants/authConstants";
import adminRoutes from "@/router/adminRoutes";

export default {
  components: {
    "auth-window": AuthWindow,
    "recover-password": RecoverPassword,
  },
  data() {
    return {
      loginRoute: adminRoutes.LOGIN.name,
      dashboardRoute: adminRoutes.DASHBOARD.name,
      role: authConstants.ADMINISTRATOR,
    };
  },
};
</script>
