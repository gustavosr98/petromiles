<template>
  <client-layout>
  	<user-detail></user-detail>
  </client-layout>
</template>

<script>
import ClientLayout from "@/modules/Client/components/ClientLayout";
import UserDetail from "@/modules/User/views/Detail.vue";


export default {
  name: "client-profile",
  components: {
    "client-layout": ClientLayout,
    "user-detail" : UserDetail,
  },
};
</script>
