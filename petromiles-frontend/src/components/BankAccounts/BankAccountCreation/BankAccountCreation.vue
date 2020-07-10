<template>
  <v-row align="center" justify="center" class="mx-auto">
    <v-col cols="12" md="8">
      <v-stepper v-model="e1">
        <v-col align="center">
          <h4 class="mb-1 mt-3 headline">{{ $t("bank-account-creation.createBankAccountTitle") }}</h4>
          <h4 class="overline mb-2">{{ $t("bank-account-creation.createBankAccountSubtitle") }}</h4>
        </v-col>
        <v-stepper-header class="accent">
          <v-stepper-step
            color="primary"
            v-for="(step, index) in steps"
            :key="index"
            :complete="e1 > parseInt(step.number)"
            :step="step.number"
          >{{ step.name }}</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <owner-details @nextStep="nextStep" step="1" />
          <bank-account-details @backStep="backStep" @nextStep="nextStep" step="2" />
          <confirm-verification @finish="finish" step="3" :message="message" />
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import StepBankAccountDetails from "@/components/BankAccounts/BankAccountCreation/StepBankAccountDetails";
import StepOwnerDetails from "@/components/BankAccounts/BankAccountCreation/StepOwnerDetails";
import StepConfirm from "@/components/BankAccounts/BankAccountCreation/StepConfirm";
export default {
  components: {
    "bank-account-details": StepBankAccountDetails,
    "owner-details": StepOwnerDetails,
    "confirm-verification": StepConfirm,
  },
  data() {
    return {
      e1: 1,
      message: "",
      steps: [
        {
          name: this.$tc("bank-account-creation.ownerDetailsStep"),
          number: "1",
        },
        {
          name: this.$tc("bank-account-creation.bankAccountDetailsStep"),
          number: "2",
        },
        {
          name: this.$tc("bank-account-creation.checkUserAccountStep"),
          number: "3",
        },
      ],
    };
  },
  methods: {
    nextStep(step) {
      this.e1 = step;
    },
    backStep(step) {
      this.e1 = step;
    },
    finish() {
      this.$emit("finish");
    },
  },
};
</script>
