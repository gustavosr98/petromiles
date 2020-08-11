<template>
  <v-col cols="12" md="5">
    <v-card-text class="mt-12">
      <h4 class="text-center mt-3 mb-5 caption">{{ title }}</h4>
      <v-form>
        <v-text-field
          label="Email"
          name="Email"
          v-model="email"
          prepend-icon="email"
          type="text"
          color="light-blue darken-4"
          @change="$v.email.$touch()"
          @blur="$v.email.$touch()"
          :error-messages="emailErrors"
          data-cy="email-input"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-row class="text-center">
      <v-col :cols="showClientElement ? '6' : '12'">
        <h5 class="caption text-center" dark>
          Already have an account?
          <router-link :to="{ name: routeNameLogin }">Log in</router-link>
        </h5>
        <v-spacer />
      </v-col>
      <v-col cols="6" v-if="showClientElement">
        <h5 class="caption">
          New here?
          <router-link :to="{ name: routeNameSignUp }">Sign Up</router-link>
        </h5>
      </v-col>
    </v-row>
    <div class="text-center mt-3 mb-8">
      <v-btn
        @click="recoverPassword()"
        color="light-blue darken-4"
        :loading="loading"
        dark
<<<<<<< .merge_file_TKGzKF
        >Recover Password</v-btn
      >
=======
        data-cy="recover-btn"
      >Recover Password</v-btn>
>>>>>>> .merge_file_XURwvL
    </div>
    <snackbar @close="closeSnackbar" :show="snackbar" :text="text"></snackbar>
  </v-col>
</template>

<script>
import store from "@/store/index";
import NoFederatedButton from "@/components/Auth/NoFederatedButton";
import Snackbar from "@/components/General/Snackbar/Snackbar.vue";
import recoverMixin from "@/mixins/validation-forms/recover.mixin.js";
import authConstants from "@/constants/authConstants";

import clientRoutes from "@/router/clientRoutes";
import adminRoutes from "@/router/adminRoutes";

export default {
  mixins: [recoverMixin],
  components: {
    snackbar: Snackbar,
  },
  props: {
    title: { required: true, type: String },
    loginRoute: { type: String },
    signUpRoute: { type: String },
    dashboardRoute: { required: true, type: String },
    showClientElement: { required: true, type: Boolean },
    role: { required: true, type: String },
  },
  data() {
    return {
      email: "",
      routeNameLogin: this.loginRoute,
      routeNameSignUp: this.signUpRoute,
      loading: false,
      showSnackbar: false,
      text: "",
    };
  },
  methods: {
    recoverPassword() {
      this.loading = true;
      this.$http
        .post("/auth/recover-password", {
          email: this.email,
          role: this.role,
        })
        .then(res => {
          this.text = this.$tc("profile.sentEmail") + this.email;
          this.snackbar = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    closeSnackbar() {
      this.snackbar = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
