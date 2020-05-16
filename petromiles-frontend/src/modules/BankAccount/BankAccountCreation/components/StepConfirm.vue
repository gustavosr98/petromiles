<template>
  <v-stepper-content :step="step" class="mt-5" align="center">
    <!-- Showing success message-->
    <template>
      <v-col cols="12" md="10">
        <v-alert icon="mdi-clock-fast" prominent text type="success"
          >{{ message }}
        </v-alert>
      </v-col>
    </template>

    <!-- Actions -->
    <template>
      <v-row justify="end" class="ma-1 mt-8">
        <v-btn color="primary" @click="finish">Finish</v-btn>
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
    return {
      message: this.$tc(
        "bank-account-creation.bankAccountCreationSuccessMessage"
      ),
    };
  },
  methods: {
    finish() {
      this.$emit("finish");
    },
  },
};
</script>

<style lang="scss" scoped></style>
