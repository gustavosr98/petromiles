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
import ClientLayout from "@/modules/Client/components/ClientLayout";
import TransactionTable from "@/modules/Transaction/components/TransactionsTable";
import Balance from "@/modules/Transaction/components/Balance";
export default {
  name: "client-transaction-list",
  components: {
    "client-layout": ClientLayout,
    "transaction-table": TransactionTable,
    balance: Balance,
  },
};
</script>
