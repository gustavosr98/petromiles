<template>
  <admin-layout>
    <v-row align="center" justify="center" class="mx-auto">
      <v-col cols="12" md="10">
        <transaction-table url="/transaction/admin/list/all" />
      </v-col>
    </v-row>
  </admin-layout>
</template>

<script>
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import TransactionTable from "@/components/Admin/Transactions/AdminTransactionsTable";
export default {
  name: "admin-transaction-list",
  components: {
    "admin-layout": AdminLayout,
    "transaction-table": TransactionTable,
  },
};
</script>
