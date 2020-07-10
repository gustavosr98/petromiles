<template>
  <div>
    <v-card max-width="500" class="px-5 py-1" :elevation="4" color="#f0f5ff">
      <v-card-text>
        <h2 class="text-center black--text">
          {{ $t("dashboard.transactions") }} <br />
          {{ $t("dashboard.buyPoints") }}
        </h2>
      </v-card-text>
      <v-divider></v-divider>
      <div>
        <doughnut-chart
          :chartData="chartData"
          :options="options"
        ></doughnut-chart>
      </div>
      <h5 class="py-2">
        {{ $t("dashboard.totalTransactions") }}: {{ this.addPointsData.total }}
      </h5>
    </v-card>
  </div>
</template>

<script>
import Doughnut from "@/components/General/Graphics/Doughnut";
export default {
  props: {
    addPointsData: { type: Object, required: true },
  },
  name: "add-points-chart",

  components: {
    "doughnut-chart": Doughnut,
  },
  data() {
    return {
      options: {
        animation: {
          animateRotate: true,
        },
      },
    };
  },
  computed: {
    chartData() {
      return {
        hoverBorderWidth: 10,
        labels: [
          this.$t("state-name.valid"),
          this.$t("state-name.invalid"),
          this.$t("state-name.verifying"),
        ],
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#4CAF50", "#df323b", "#2196F3"],
            data: this.addPointsData.addTransactions,
          },
        ],
      };
    },
  },
};
</script>
