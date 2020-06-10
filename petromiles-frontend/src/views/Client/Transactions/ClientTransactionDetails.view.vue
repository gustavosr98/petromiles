<template>
  <client-layout>
    <transaction-information :idTransaction="id" />
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import TransactionInformation from "@/components/Transactions/TransactionInformation";
import http from "@/http/http-client";

export default {
  name: "transaction-details",
  components: {
    "client-layout": ClientLayout,
    "transaction-information": TransactionInformation,
  },
  props: {
    id: {
      type: String,
    },
  },
};
</script>
