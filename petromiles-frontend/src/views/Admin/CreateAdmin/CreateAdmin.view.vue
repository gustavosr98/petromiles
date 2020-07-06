<template>
  <admin-layout class="create-admin-content">
    <v-row align="center" justify="center">
      <v-col cols="12" md="10">
        <create-admin-form :role="role" />
      </v-col>
    </v-row>
  </admin-layout>
</template>

<script>
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import CreateAdminForm from "@/components/Admin/CreateAdmin/CreateAdminForm";
import authConstants from "@/constants/authConstants";

export default {
  name: "create-admin",
  components: {
    "admin-layout": AdminLayout,
    "create-admin-form": CreateAdminForm,
  },
  data() {
    return {
      role: authConstants.ADMINISTRATOR,
    };
  },
};
</script>

<style lang="scss" scoped>
.create-admin-content {
  padding: 0 !important;
}
</style>
