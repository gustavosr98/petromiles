<template>
  <bars-graph :datacollection="barsDatacollection" :options="barsOptions" />
</template>
<script>
import Bars from "@/components/General/Graphics/Bars.vue";

export default {
  props: {
    usersData: { type: Object, required: true },
  },
  components: {
    "bars-graph": Bars,
  },
  data() {
    return {
      barsDatacollection: {
        hoverBackgroundColor: "red",
        hoverBorderWidth: 10,
        labels: [this.$t("state-name.active"), this.$t("state-name.blocked")],
        datasets: [
          {
            label: [this.$tc("role.client", 1)],
            backgroundColor: ["#385488", "#385488"],
            data: this.usersData.clients,
          },
          {
            label: [this.$tc("role.administrator", 1)],
            backgroundColor: ["#ffd046", "#ffd046"],
            data: this.usersData.admins,
          },
        ],
      },
      barsOptions: {
        hoverBorderWidth: 20,
      },
    };
  },
};
</script>
