<template>
  <v-col cols="12" md="5">
    <v-card-text class="mt-12">
      <v-row v-if="showClientElement">
        <no-federeded-button
          v-for="provider in providers"
          :key="`${provider.name}`"
          :provider="provider"
          @login="login"
          type="login"
        >Continue with {{ provider.name }}</no-federeded-button>
      </v-row>
      <h4 class="text-center mt-3 mb-5 caption">{{ title }}</h4>
      <v-form>
        <v-text-field
          label="Email"
          name="Email"
          v-model="email"
          prepend-icon="email"
          type="text"
          color="light-blue darken-4"
          @keyup.enter="buildUser"
        ></v-text-field>
        <v-text-field
          id="password"
          label="Password"
          v-model="password"
          name="Password"
          prepend-icon="lock"
          type="password"
          color="light-blue darken-4"
          @keyup.enter="buildUser"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-row class="text-center">
      <v-col :cols="showClientElement ? '6' : '12'">
        <h5 class="caption">
          Forgot your password?
          <router-link :to="{ name: routeNameRecover }">Recover</router-link>
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
      <v-btn @click="buildUser()" color="light-blue darken-4" dark :loading="loading">Login</v-btn>
    </div>
  </v-col>
</template>

<script>
import store from "@/store/index";
import NoFederatedButton from "@/components/Auth/NoFederatedButton";
import { providersMixin } from "@/mixins/auth/firebaseProvider";

import clientRoutes from "@/router/clientRoutes";

export default {
  mixins: [providersMixin],
  components: {
    "no-federeded-button": NoFederatedButton,
  },

  props: {
    title: { required: true, type: String },
    signUpRoute: { type: String },
    recoverRoute: { type: String },
    dashboardRoute: { required: true, type: String },
    showClientElement: { required: true, type: Boolean },
    role: { required: true, type: String },
  },
  data() {
    return {
      email: "",
      password: "",
      routeNameSignUp: this.signUpRoute,
      routeNameRecover: this.recoverRoute,
      loading: false,
    };
  },
  methods: {
    buildUser() {
      this.loading = true;
      const user = {
        email: this.email,
        password: this.password,
        role: this.role,
      };
      this.login(user);
    },

    login(user) {
      store.dispatch("auth/logIn", user).then(() => {
        this.$router.push({ name: this.dashboardRoute });
      })
      .finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
