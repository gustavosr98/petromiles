<template>
  <v-row align="center" justify="center" class="mx-auto">
    <v-col cols="12" md="8">
      <datatable :title="title" :headers="headers" :fetchedData="mungedData"></datatable>
    </v-col>
  </v-row>
</template>

<script>
import Datatable from "@/components/datatable/Datatable";

export default {
  name: "bank-accounts-table",
  components: {
    Datatable,
  },
  data() {
    return {
      fetchedData: [],
    };
  },
  async mounted() {
    this.fetchedData = await this.$http.get("/bank-account");
    this.$store.commit("bankAccount/SET_BANK_ACCOUNTS", this.fetchedData);
  },
  computed: {
    title() {
      return this.$tc("navbar.bankAccount");
    },
    headers() {
      return [
        {
          text: `${this.$tc("common.code")}`,
          align: "center",
          value: "idBankAccount",
        },
        {
          text: this.$tc("common.type"),
          align: "center",
          value: "type",
        },
        {
          text: this.$tc("bank-account-properties.lastFourDigits"),
          align: "center",
          value: "accountNumber",
        },
        {
          text: this.$tc("common.state"),
          align: "center",
          value: "state",
        },
      ];
    },
    mungedData() {
      return this.fetchedData.map(data => {
        const state = this.$tc(
          `state-name.${data.clientBankAccount[0].stateBankAccount[0].state.name}`
        );
        const bankAccountType = this.$tc(
          `bank-account-properties.${data.type.toLowerCase()}`
        );
        return {
          ...data,
          bankAccountType,
          state,
        };
      });
    },
  },
};
</script>
