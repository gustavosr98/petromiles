<template>
  <client-layout>
    <buy-points-form />
  </client-layout>
</template>

<script>
import ClientLayout from "@/modules/Client/components/ClientLayout";
import BuyPointsForm from "@/modules/Payments/Points/components/BuyPointsForm";

export default {
  name: "client-buy-points",
  components: {
    "client-layout": ClientLayout,
    "buy-points-form": BuyPointsForm,
  },
};
</script>
