<template>
  <client-layout>
    <user-subscription-info></user-subscription-info>
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import UserSubscription from "@/components/Users/Subscriptions/UserSubscription";

export default {
  name: "client-profile",
  components: {
    "client-layout": ClientLayout,
    "user-subscription-info": UserSubscription,
  },
};
</script>