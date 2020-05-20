<template>
  <datatable :title="title" :headers="headers" data-url="/user/ADMINISTRATOR" />
</template>

<script>
import Datatable from "@/components/datatable/Datatable";

export default {
  name: "administrators-table",
  components: {
    Datatable,
  },
  data() {
    return {
      title: `${this.$tc("navbar.user", 1)}`,
      headers: [
        {
          text: "ID",
          align: "start",
          value: "idUserAdministrator",
        },
        {
          text: this.$tc("user-details.email"),
          value: "email",
        },
        {
          text: this.$tc("user-details.firstName"),
          value: "userDetails.firstName",
        },
        {
          text: this.$tc("user-details.lastName"),
          value: "userDetails.lastName",
        },
      ],
    };
  },
};
</script>
