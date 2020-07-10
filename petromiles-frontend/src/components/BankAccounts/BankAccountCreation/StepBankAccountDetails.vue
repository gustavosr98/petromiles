<template>
  <v-stepper-content :step="step" justify="center">
    <v-row justify="center">
      <header class="font-weight-light">{{ $t("bank-account-creation.bankAccountFormTitle") }}</header>
    </v-row>

    <!-- Form for account details -->
    <v-form>
      <v-row class="ma-5" justify="center">
        <v-col cols="12" md="5">
          <v-autocomplete
            :items="types"
            v-model="type"
            :label="$t('bank-account-properties.accountType')"
            @change="$v.type.$touch()"
            @blur="$v.type.$touch()"
            :error-messages="typeError"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="5">
          <v-autocomplete
            :items="banks"
            v-model="bank"
            :label="$t('bank-account-details.bank')"
            @change="$v.bank.$touch()"
            @blur="$v.bank.$touch()"
            :error-messages="bankError"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="ma-5" justify="center">
        <v-col cols="12" md="5">
          <v-text-field
            prepend-icon="mdi-numeric"
            v-model="accountNumber"
            :label="$t('bank-account-properties.accountNumber')"
            type="text"
            @change="$v.accountNumber.$touch()"
            @blur="$v.accountNumber.$touch()"
            :error-messages="accountNumberError"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            prepend-icon="mdi-bank"
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
            prepend-icon="create"
            v-model="nickname"
            :label="$t('bank-account-properties.nickname')"
            type="text"
            @change="$v.nickname.$touch()"
            @blur="$v.nickname.$touch()"
            :error-messages="nicknameError"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <!-- Actions -->

    <v-row justify="space-between" class="ma-1 mt-8">
      <v-btn text @click="backStep">
        {{
        $t("bank-account-creation-form.cancel")
        }}
      </v-btn>
      <v-btn
        color="primary"
        @click="nextStep"
        :loading="processing"
        :disable="processing"
      >{{ $t("bank-account-creation-form.continueButton") }}</v-btn>
    </v-row>
  </v-stepper-content>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import BankAccountConstants from "@/constants/bankAccount.js";

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
      bank: null,
      processing: false,
      error: false,
      banks: null,
      banksFound: null,
      nickname: "",
      types: [
        `${this.$tc("bank-account-properties.saving")}`,
        `${this.$tc("bank-account-properties.checking")}`,
      ],
    };
  },
  mounted() {
    this.getBanks();
  },
  methods: {
    ...mapActions("bankAccount", ["setBankAccount"]),
    async getBanks() {
      this.banksFound = await this.$http.get("management/banks");
      this.banks = this.banksFound.map(bank => bank.name);
    },
    async nextStep() {
      // Checking if all fields are valid
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const bankAccount = {
          routingNumber: this.routingNumber,
          type: BankAccountConstants.types[this.type.toLowerCase()],
          accountNumber: this.accountNumber,
          checkNumber: this.checkNumber,
          nickname: this.nickname,
          bank: this.getBankDetails(this.bank),
        };

        this.processing = true;
        await this.setBankAccount(bankAccount).finally(() => {
          this.processing = false;
        });

        this.$emit("nextStep", parseInt(this.step) + 1);
      }
    },
    backStep() {
      this.$emit("backStep", parseInt(this.step) - 1);
    },
    getBankDetails(bank) {
      return this.banksFound.find(b => b.name == bank);
    },
  },

  // Validations
  validations: {
    routingNumber: { required },
    bank: { required },
    type: { required },
    checkNumber: { required, minLength: minLength(4), maxLength: maxLength(4) },
    accountNumber: { required },
    nickname: { required, maxLength: maxLength(255) },
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
    typeError() {
      const errors = [];
      if (!this.$v.type.$dirty) return errors;
      !this.$v.type.required &&
        errors.push(
          `${this.$tc("bank-account-creation-form.typeEmptyValidation")}`
        );
      return errors;
    },
    bankError() {
      const errors = [];
      if (!this.$v.bank.$dirty) return errors;
      !this.$v.bank.required &&
        errors.push(
          `${this.$tc("bank-account-creation-form.bankEmptyValidation")}`
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
    nicknameError() {
      const errors = [];
      if (!this.$v.nickname.$dirty) return errors;
      !this.$v.nickname.required &&
        errors.push(
          `${this.$tc("bank-account-creation-form.nicknameEmptyValidation")}`
        );
      !this.$v.nickname.maxLength &&
        errors.push(
          `${this.$tc("bank-account-creation-form.nicknameLengthValidation")}`
        );
      return errors;
    },
  },
};
</script>

<style lang="scss" scoped></style>
