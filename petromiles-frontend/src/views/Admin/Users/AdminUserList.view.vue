<template>
  <admin-layout>
    <v-tabs fixed-tabs background-color="secondary">
      <!-- CLIENTS TAB -->
      <v-tab key="clients">{{ this.$tc("role.client", 1) }}</v-tab>
      <v-tab-item key="clients">
        <clients-table />
      </v-tab-item>

      <!-- ADMINISTRATORS TAB -->
      <v-tab key="administrators">
        {{
        this.$tc("role.administrator", 1)
        }}
      </v-tab>
      <v-tab-item key="administrators">
        <administrators-table />
      </v-tab-item>
    </v-tabs>
  </admin-layout>
</template>

<script>
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import ClientsTable from "@/components/Users/ClientsTable";
import AdministratorsTable from "@/components/Users/AdministratorsTable";

export default {
  name: "admin-user-list",
  components: {
    "admin-layout": AdminLayout,
    "clients-table": ClientsTable,
    "administrators-table": AdministratorsTable,
  },
};
</script>
