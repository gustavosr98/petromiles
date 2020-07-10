<template>
  <client-layout>
    <dashboard />
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import Dashboard from "@/components/Client/Dashboard/Dashboard.vue";

export default {
  name: "client-dashboard",
  components: {
    "client-layout": ClientLayout,
    dashboard: Dashboard,
  },
};
</script>
