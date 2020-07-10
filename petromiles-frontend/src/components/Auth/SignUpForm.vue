<template>
  <v-col cols="12" md="5">
    <v-card-text class="mt-12">
      <v-row>
        <no-federeded-button
          v-for="provider in providers"
          :key="`${provider.name}`"
          :provider="provider"
          @signUp="signUp"
          type="signUp"
        >Sign Up with {{ provider.name }}</no-federeded-button>
      </v-row>
      <h4 class="text-center mt-4 caption">Or sign up with</h4>
      <v-form ref="signUpForm" v-model="formValidity">
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Name"
              name="Name"
              v-model="firstName"
              prepend-icon="person"
              type="text"
              color="light-blue darken-4"
              @change="$v.firstName.$touch()"
              @blur="$v.firstName.$touch()"
              :error-messages="firstNameErrors"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="Last Name"
              name="Last Name"
              v-model="lastName"
              type="text"
              color="light-blue darken-4"
              @change="$v.lastName.$touch()"
              @blur="$v.lastName.$touch()"
              :error-messages="lastNameErrors"
            ></v-text-field>
          </v-col>
        </v-row>

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
        ></v-text-field>
        <v-text-field
          label="Password"
          name="Password"
          v-model="password"
          prepend-icon="lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          :type="showPassword ? 'text' : 'password'"
          color="light-blue darken-4"
          @change="$v.password.$touch()"
          @blur="$v.password.$touch()"
          :error-messages="passwordErrors"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <div class="text-left">
      <h5 class="caption text-center" dark>
        Already have an account?
        <router-link :to="{ name: routeNameLogin }">Log in</router-link>
      </h5>
    </div>
    <div class="text-center mt-3 mb-8">
      <v-btn :loading="loading" @click="ckeckingValidForm" type="submit" class="light-blue darken-4" dark>SIGN UP</v-btn>
    </div>
  </v-col>
</template>

<script>
import store from "@/store/index";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  minLength,
} from "vuelidate/lib/validators";
import NoFederatedButton from "@/components/Auth/NoFederatedButton";
import { providersMixin } from "@/mixins/auth/firebaseProvider";
import clientRoutes from "@/router/clientRoutes";

export default {
  mixins: [validationMixin, providersMixin],
  components: {
    "no-federeded-button": NoFederatedButton,
  },
  data() {
    return {
      formValidity: false,
      showPassword: false,
      firstName: "",
      email: "",
      password: "",
      lastName: "",
      routeNameLogin: clientRoutes.LOGIN.name,
      loading: false,
    };
  },
  validations: {
    firstName: { required },
    lastName: { required },
    email: { required, email },
    password: { required, minLength: minLength(8), maxLength: maxLength(16) },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.required && errors.push("Name is required");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required && errors.push("Last name is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      !this.$v.password.minLength &&
        errors.push("Password must have at least 8 characters");
      !this.$v.password.maxLength &&
        errors.push("Password must have at most 16 characters");

      return errors;
    },
  },
  methods: {
    goToLogin() {
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";
      this.$router.name(clientRoutes.LOGIN.name);
    },
    ckeckingValidForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) this.buildUser();
    },
    buildUser() {
      this.loading = true;
      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      };
      this.signUp(user);
    },

    signUp(user) {
      store.dispatch("auth/signUp", user).then(() => {
        this.$router.push({ name: clientRoutes.DASHBOARD.name });
      })
      .finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
