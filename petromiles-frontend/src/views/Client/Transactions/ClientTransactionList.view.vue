<template>
  <client-layout>
    <v-row align="center" justify="center" class="mx-auto">
      <v-col cols="12" md="10">
        <balance />
        <transaction-table />
      </v-col>
    </v-row>
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import TransactionTable from "@/components/Transactions/TransactionsTable";
import Balance from "@/components/Transactions/Balance";
export default {
  name: "client-transaction-list",
  components: {
    "client-layout": ClientLayout,
    "transaction-table": TransactionTable,
    balance: Balance,
  },
};
</script>
