<template>
  <datatable :title="title" :headers="headers" :fetchedData="mungedData" />
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
      title: this.$tc("navbar.transaction", 1),
      fetchedData: [],
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
        {
          text: this.$tc("common.state"),
          value: "state",
        },
      ],
    };
  },
  async mounted() {
    this.fetchedData = await this.$http.get("/user/ADMINISTRATOR");
  },
  computed: {
    mungedData() {
      return this.fetchedData.map(data => {
        const state = this.$tc(`state-name.${data.stateUser[0].state.name}`);
        return {
          ...data,
          state,
        };
      });
    },
  },
};
</script>
