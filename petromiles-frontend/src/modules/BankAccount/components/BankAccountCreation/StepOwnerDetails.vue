<template>
  <v-stepper-content :step="step">
    <!-- Subtitle -->
    <v-row justify="center">
      <header class="font-weight-light">{{ $t("bank-account-creation.ownerDetailsFormTitle") }}</header>
    </v-row>

    <!-- Form for owner of the account -->
    <v-form>
      <v-row class="ma-5" justify="center">
        <v-col cols="12" md="5">
          <v-text-field
            prepend-icon="face"
            v-model="firstName"
            :label="$t('user-details.firstName')"
            type="text"
            @change="$v.firstName.$touch()"
            @blur="$v.firstName.$touch()"
            :error-messages="firstNameError"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            prepend-icon="people"
            v-model="lastName"
            :label="$t('user-details.lastName')"
            type="text"
            @change="$v.lastName.$touch()"
            @blur="$v.lastName.$touch()"
            :error-messages="lastNameError"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <v-row class="ma-5" justify="center">
      <v-col cols="12" md="5">
        <v-text-field
          prepend-icon="phone"
          v-model="phone"
          :label="$t('user-details.phone')"
          type="number"
          @change="$v.phone.$touch()"
          @blur="$v.phone.$touch()"
          :error-messages="phoneError"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="5">
        <v-text-field
          prepend-icon="mail"
          v-model="email"
          :label="$t('user-details.email')"
          type="text"
          @change="$v.email.$touch()"
          @blur="$v.email.$touch()"
          :error-messages="emailError"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row justify="end" class="ma-1 mt-8">
      <v-btn color="primary" @click="nextStep()">
        {{
        $t("bank-account-creation-form.continueButton")
        }}
      </v-btn>
    </v-row>
  </v-stepper-content>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  props: {
    step: {
      required: true,
    },
  },
  data() {
    return {
      firstName: "",
      phone: "",
      lastName: "",
      email: "",
    };
  },
  mounted() {
    // Taking the user information
    if (this.user) {
      this.firstName = this.user.details.firstName;
      this.lastName = this.user.details.lastName;
      this.phone = this.user.details.phone;
      this.email = this.user.email;
    }
  },
  methods: {
    ...mapActions("bankAccount", ["setUserDetails"]),
    nextStep() {
      // Checking if all fields are valid
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.setUserDetails({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
        });
        // Sending owner details to the store
        this.$emit("nextStep", parseInt(this.step) + 1);
      }
    },
  },
  // Validations
  validations: {
    firstName: { required },
    lastName: { required },
    phone: { required },
    email: { required, email },
  },
  computed: {
    ...mapState("auth", ["user"]),
    firstNameError() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.required &&
        errors.push(
          `${this.$tc("user-registration-form.firstNameEmptyValidation")}`
        );
      return errors;
    },
    lastNameError() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required &&
        errors.push(
          `${this.$tc("user-registration-form.lastNameEmptyValidation")}`
        );
      return errors;
    },
    phoneError() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.required &&
        errors.push(
          `${this.$tc("user-registration-form.phoneEmptyValidation")}`
        );
      return errors;
    },
    emailError() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required &&
        errors.push(
          `${this.$tc("user-registration-form.emailEmptyValidation")}`
        );
      !this.$v.email.email &&
        errors.push(`${this.$tc("user-registration-form.emailValidation")}`);
      return errors;
    },
  },
};
</script>

<style lang="scss" scoped></style>
