<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-title class="title">
        {{
        $t("bank-account-validation.verifyYourBankAccount")
        }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mt-2">
        {{
        $t("bank-account-validation.verifyBankAccountMessage")
        }}
      </v-card-text>
      <v-container>
        <v-row justify="center" align="center" class="mx-3">
          <v-col cols="12" md="4">
            <div>{{ $t("common.amounts") }}:</div>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              cols="2"
              label="$ 0.00"
              v-model="firstAmount"
              name="First amount"
              type="number"
              color="light-blue darken-4"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              label="$ 0.00"
              name="Second amount"
              v-model="secondAmount"
              type="number"
              color="light-blue darken-4"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary darken-1" text @click="closeModal">
          {{
          $t("common.cancel")
          }}
        </v-btn>
        <v-btn
          color="primary darken-1"
          text
          @click="validateBankAccount"
          :loading="loading"
        >{{ $t("bank-account-validation.validateButton") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, required: true },
    clientBankAccountId: { required: true },
  },
  data() {
    return {
      firstAmount: null,
      secondAmount: null,
      loading: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    async validateBankAccount() {
      this.loading = true;
      await this.$http
        .post("/bank-account/verify", {
          clientBankAccountId: this.clientBankAccountId,
          amounts: [
            parseFloat(this.firstAmount),
            parseFloat(this.secondAmount),
          ],
        })
        .then(() => {
          this.$emit("finish");
        })
        .finally(() => {
          this.loading = false;
        });
      this.$emit("closeModal");
    },
  },
};
</script>
