<template>
  <client-layout>
    <transaction-information :idTransaction="id" />
  </client-layout>
</template>

<script>
import ClientLayout from "@/modules/Client/components/ClientLayout";
import TransactionInformation from "@/modules/Transaction/components/TransactionInformation";
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
