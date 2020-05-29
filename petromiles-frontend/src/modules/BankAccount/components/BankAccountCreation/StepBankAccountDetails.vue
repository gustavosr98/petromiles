<template>
  <v-stepper-content :step="step" justify="center">
    <v-row justify="center">
      <v-col cols="6">
        <v-alert
          v-if="error"
          dismissible
          dense
          outlined
          type="error"
          class="my-4"
        >
          <strong>{{
            $t("bank-account-creation.errorMessageBankAccountCreation")
          }}</strong>
        </v-alert>
      </v-col>
    </v-row>

    <v-row justify="center">
      <header class="font-weight-light">
        {{ $t("bank-account-creation.bankAccountFormTitle") }}
      </header>
    </v-row>

    <!-- Form for account details -->
    <v-form>
      <v-row class="ma-5" justify="center">
        <v-col cols="12" md="5">
          <v-autocomplete
            :items="types"
            v-model="type"
            :label="$t('bank-account-properties.accountType')"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            prepend-icon="check"
            v-model="routingNumber"
            :label="$t('bank-account-properties.routingNumber')"
            type="text"
            @change="$v.routingNumber.$touch()"
            @blur="$v.routingNumber.$touch()"
            :error-messages="routingNumberError"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="ma-5" justify="center">
        <v-col cols="12" md="5">
          <v-text-field
            prepend-icon="check"
            v-model="checkNumber"
            :label="$t('bank-account-properties.checkNumber')"
            type="text"
            @change="$v.checkNumber.$touch()"
            @blur="$v.checkNumber.$touch()"
            :error-messages="checkNumberError"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            prepend-icon="check"
            v-model="accountNumber"
            :label="$t('bank-account-properties.accountNumber')"
            type="text"
            @change="$v.accountNumber.$touch()"
            @blur="$v.accountNumber.$touch()"
            :error-messages="accountNumberError"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- Actions -->

    <v-row justify="space-between" class="ma-1 mt-8">
      <v-btn text @click="backStep">{{
        $t("bank-account-creation-form.cancel")
      }}</v-btn>
      <v-btn
        color="primary"
        @click="nextStep"
        :loading="processing"
        :disable="processing"
        >{{ $t("bank-account-creation-form.continueButton") }}</v-btn
      >
    </v-row>
  </v-stepper-content>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  props: {
    step: { required: true },
  },
  data() {
    return {
      type: "",
      routingNumber: null,
      checkNumber: null,
      accountNumber: null,
      processing: false,
      error: false,
      types: [
        `${this.$tc("bank-account-properties.saving")}`,
        `${this.$tc("bank-account-properties.checking")}`,
      ],
    };
  },
  methods: {
    ...mapActions("bankAccount", ["setBankAccount"]),
    async nextStep() {
      const bankAccount = {
        routingNumber: this.routingNumber,
        type: this.type,
        accountNumber: this.accountNumber,
        checkNumber: this.checkNumber,
      };

      // Checking if all fields are valid
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.processing = true;
        await this.setBankAccount(bankAccount)
          .then(() => {
            this.$emit("nextStep", parseInt(this.step) + 1);
          })
          .catch(error => {
            console.log(`Failed to associate bank account because: ${error}`);
            this.error = true;
          });
        this.processing = false;
      }
    },
    backStep() {
      this.$emit("backStep", parseInt(this.step) - 1);
    },
  },

  // Validations
  validations: {
    routingNumber: { required },
    checkNumber: { required, minLength: minLength(4), maxLength: maxLength(4) },
    accountNumber: {
      required,
    },
  },

  computed: {
    routingNumberError() {
      const errors = [];
      if (!this.$v.routingNumber.$dirty) return errors;
      !this.$v.routingNumber.required &&
        errors.push(
          `${this.$tc(
            "bank-account-creation-form.routingNumberEmptyValidation"
          )}`
        );
      return errors;
    },
    checkNumberError() {
      const errors = [];
      if (!this.$v.checkNumber.$dirty) return errors;
      !this.$v.checkNumber.required &&
        errors.push(
          `${this.$tc("bank-account-creation-form.checkNumberEmptyValidation")}`
        );
      !this.$v.checkNumber.minLength &&
        errors.push(
          `${this.$tc(
            "bank-account-creation-form.checkNumberLengthValidation"
          )}`
        );
      !this.$v.checkNumber.maxLength &&
        errors.push(
          `${this.$tc(
            "bank-account-creation-form.checkNumberLengthValidation"
          )}`
        );
      return errors;
    },
    accountNumberError() {
      const errors = [];
      if (!this.$v.accountNumber.$dirty) return errors;
      !this.$v.accountNumber.required &&
        errors.push(
          `${this.$tc(
            "bank-account-creation-form.accountNumberEmptyValidation"
          )}`
        );
      return errors;
    },
  },
};
</script>

<style lang="scss" scoped></style>
