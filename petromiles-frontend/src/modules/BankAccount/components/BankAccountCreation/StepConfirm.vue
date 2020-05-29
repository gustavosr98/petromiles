<template>
  <v-stepper-content :step="step" class="mt-5" align="center">
    <!-- Showing success message-->
    <template>
      <v-col cols="12" md="10">
        <v-alert icon="mdi-clock-fast" prominent text type="success">
          {{ this.$tc(
          "bank-account-creation.bankAccountCreationSuccessMessage"
          ), }}
        </v-alert>
      </v-col>
    </template>

    <!-- Actions -->
    <template>
      <v-row justify="end" class="ma-1 mt-8">
        <v-btn color="primary" @click="finish">
          {{ this.$tc(
          "common.ok"
          ), }}
        </v-btn>
      </v-row>
    </template>
  </v-stepper-content>
</template>

<script>
export default {
  props: {
    step: { required: true },
  },
  data() {
    return {};
  },
  methods: {
    finish() {
      this.$emit("finish");
    },
  },
};
</script>

<style lang="scss" scoped></style>
