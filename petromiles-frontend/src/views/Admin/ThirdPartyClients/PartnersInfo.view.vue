<template>
  <admin-layout class="pt-0">
    <partners-details />
  </admin-layout>
</template>

<script>
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import PartnersDetails from "@/components/Admin/Partners/PartnersDetails";
export default {
  name: "partners-info",
  components: {
    "admin-layout": AdminLayout,
    "partners-details": PartnersDetails,
  },
};
</script>
