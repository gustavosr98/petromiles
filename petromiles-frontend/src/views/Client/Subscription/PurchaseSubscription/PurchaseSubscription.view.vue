<template>
  <client-layout>
    <user-suscription-purchase></user-suscription-purchase>
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import SubscriptionPurchase from "@/components/Users/Subscriptions/Purchase/SubscriptionPurchase";
                                    
export default {
  name: "client-profile",
  components: {
    "client-layout": ClientLayout,
    "user-suscription-purchase": SubscriptionPurchase,
  },
};
</script>