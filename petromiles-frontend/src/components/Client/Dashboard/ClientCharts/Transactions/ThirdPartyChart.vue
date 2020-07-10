<template>
  <div>
    <v-card max-width="500" class="px-5 py-1" :elevation="4" color="#f0f5ff">
      <v-card-text>
        <h2 class="text-center black--text">
          {{ $t("dashboard.transactions") }} <br />
          {{ $t("dashboard.thirdPartyTransactions") }}
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
        {{ $t("dashboard.totalTransactions") }}: {{ totalData }}
      </h5>
    </v-card>
  </div>
</template>

<script>
import Doughnut from "@/components/General/Graphics/Doughnut";
export default {
  props: {
    thirdPartyData: { type: Object, required: true },
  },
  name: "third-party-chart",
  components: {
    "doughnut-chart": Doughnut,
  },
  data() {
    return {
      totalData: this.thirdPartyData.total,
      options: {
        hoverBorderWidth: 20,
      },
    };
  },
   computed: {
      chartData() {
        return {
        hoverBackgroundColor: "red",
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
            data: this.thirdPartyData.ThirdsPartyTransactions,
          },
        ],
      };
    },
  },
};
</script>
