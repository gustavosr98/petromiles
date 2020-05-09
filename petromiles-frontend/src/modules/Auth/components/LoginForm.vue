<template>
  <v-col cols="12" md="5">
    <v-card-text class="mt-12">
      <h4 class="text-center mt-4 .subtitle-2">Log in with your PetroMiles account</h4>
      <v-form ref="signUpForm">
        <v-text-field
          label="Email"
          name="Email"
          v-model="email"
          prepend-icon="email"
          type="text"
          color="light-blue darken-4"
        ></v-text-field>
        <v-text-field
          id="password"
          label="Password"
          v-model="password"
          name="Password"
          prepend-icon="lock"
          type="password"
          color="light-blue darken-4"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-row class="text-center">
      <v-col cols="6">
        <h5 class="caption">Forgot your password ?</h5>
        <v-spacer />
      </v-col>
      <v-col cols="6">
        <h5 class="caption">
          New here?
          <router-link :to="{ name: 'SignUp' }">Sign Up</router-link>
        </h5>
      </v-col>
    </v-row>
    <div class="text-center mt-3">
      <v-btn @click="login()" color="light-blue darken-4" dark>Login</v-btn>
    </div>
  </v-col>
</template>

<script>
import store from "@/store/index";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      const user = {
        email: this.email,
        password: this.password,
      };
      store
        .dispatch("auth/logIn", user)
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>