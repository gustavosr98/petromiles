<template>
  <datatable :title="title" :headers="headers" data-url="/user/CLIENT" />
</template>

<script>
import Datatable from "@/components/datatable/Datatable";

export default {
  name: "clients-table",
  components: {
    Datatable,
  },
  data() {
    return {
      title: this.$tc("navbar.user", 1),
      headers: [
        {
          text: "ID",
          align: "start",
          value: "idUserClient",
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