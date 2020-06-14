<template>
  <client-layout>
    <exchange-points-form />
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import ExchangePointsForm from "@/components/Withdrawal/ExchangePointsForm";

export default {
  name: "client-sell-points",
  components: {
    "client-layout": ClientLayout,
    "exchange-points-form": ExchangePointsForm,
  },
};
</script>
