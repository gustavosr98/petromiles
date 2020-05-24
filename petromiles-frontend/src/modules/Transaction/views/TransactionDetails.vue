<template>
  <client-layout>This is Transaction id: {{id}}</client-layout>
</template>

<script>
import ClientLayout from "@/modules/Client/components/ClientLayout";

export default {
  name: "transaction-details",
  components: {
    "client-layout": ClientLayout,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script>
