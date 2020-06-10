<template>
  <client-layout>
    <user-detail-wrapper></user-detail-wrapper>
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import UserDetailWrapper from "@/components/Users/UserDetailWrapper";

export default {
  name: "client-profile",
  components: {
    "client-layout": ClientLayout,
    "user-detail-wrapper": UserDetailWrapper,
  },
};
</script>
