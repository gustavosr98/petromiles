<template>
  <admin-layout class="pt-0 mx-0">
    <dashboard />
  </admin-layout>
</template>

<script>
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import Dashboard from "@/components/Admin/Dashboard/Dashboard.vue";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: true,
  },
};

export default {
  name: "admin-dashboard",
  components: {
    "admin-layout": AdminLayout,
    dashboard: Dashboard,
  },
};
</script>
