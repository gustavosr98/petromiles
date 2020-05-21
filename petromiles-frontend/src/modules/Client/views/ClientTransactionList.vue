<template>
  <client-layout>
    <balance />
  </client-layout>
</template>

<script>
import ClientLayout from "@/modules/Client/components/ClientLayout";
import Balance from "@/modules/Transaction/components/Balance";
export default {
  name: "client-transaction-list",
  components: {
    "client-layout": ClientLayout,
    balance: Balance,
  },
};
</script>
