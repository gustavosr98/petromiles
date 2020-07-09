<template>
  <doughnut-graph :chart-data="chartData" :options="options"></doughnut-graph>
</template>
<script>
import DoughnutGraph from "@/components/General/Graphics/Doughnut.vue";

export default {
  components: {
    "doughnut-graph": DoughnutGraph,
  },
  props: {
    bankAccountsData: { type: Object, required: true },
  },
  data() {
    return {
      options: {
        animation: {
          animateRotate: true,
        },
      },
      chartData: {
        labels: [
          this.$t("state-name.valid"),
          this.$t("state-name.verifying"),
          this.$t("state-name.blocked"),
        ],
        datasets: [
          {
            backgroundColor: ["#1B3D6E", "#59A7F5", "#E26C6C"],
            data: this.bankAccountsData.accounts,
          },
        ],
      },
    };
  },
};
</script>
