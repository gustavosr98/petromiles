<template>
  <v-col cols="12" md="5">
    <v-card-text class="mt-12">
      <h4 class="text-center mt-4 .subtitle-2">Sign Up with PetroMiles</h4>
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
        <router-link :to="{ name: 'Login' }">Log in</router-link>
      </h5>
    </div>
    <div class="text-center mt-5 mb-8">
      <v-btn @click="signUp()" type="submit" class="light-blue darken-4" dark>SIGN UP</v-btn>
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
  alpha,
} from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  data() {
    return {
      formValidity: false,
      showPassword: false,
      firstName: "",
      email: "",
      password: "",
      lastName: "",
    };
  },
  validations: {
    firstName: { required, alpha },
    lastName: { required, alpha },
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
      !this.$v.firstName.alpha && errors.push("Name must have letters");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required && errors.push("Last name is required");
      !this.$v.lastName.alpha && errors.push("Last name must have letters");

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
      this.$router.name("Login");
    },
    signUp() {
      this.$v.$touch();
      // Se verifica que el form tenga datos correctos:
      if (!this.$v.$invalid) {
        const user = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        };
        store
          .dispatch("auth/signUp", user)
          .then(() => {
            this.$router.push({ name: "Home" });
          })
          .catch(err => {
            console.log(err.response.data.message);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
