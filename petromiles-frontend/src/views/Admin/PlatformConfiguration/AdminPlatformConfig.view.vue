<template>
  <admin-layout class="py-0">
    <v-row justify="center" class="mx-5">
      <configuration-form />
    </v-row>
  </admin-layout>
</template>
<script>
import ConfigurationForm from "@/components/Admin/PlatformConfiguration/ConfigurationForm";
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";

export default {
  components: {
    "configuration-form": ConfigurationForm,
    "admin-layout": AdminLayout,
  },
};
</script>
