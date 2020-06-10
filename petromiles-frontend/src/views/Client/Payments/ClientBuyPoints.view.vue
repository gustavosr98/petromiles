<template>
  <client-layout>
    <buy-points-form />
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import BuyPointsForm from "@/components/Payments/BuyPointsForm";

export default {
  name: "client-buy-points",
  components: {
    "client-layout": ClientLayout,
    "buy-points-form": BuyPointsForm,
  },
};
</script>
