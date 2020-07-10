<template>
  <div>
    <v-card max-width="500" class="px-5 py-3" :elevation="4" color="#f0f5ff">
      <v-card-text>
        <h2 class="text-center black--text">
          {{ $t("dashboard.totalTransactions") }} <br />
        </h2>
      </v-card-text>
      <v-divider></v-divider>
      <div>
        <polararea-chart
          :chartData="chartData"
          :options="options"
        ></polararea-chart>
      </div>
      <h5 class="pt-2 mt-4">
        {{ $t("dashboard.totalTransactions") }}: {{ totalData }}
      </h5>
    </v-card>
  </div>
</template>

<script>
import PolarArea from "@/components/General/Graphics/PolarArea";
export default {
  props: {
    totalTransactionsData: { type: Object, required: true },
  },
  name: "total-transactions-chart",
  components: {
    "polararea-chart": PolarArea,
  },
  data() {
    return {
      totalData: this.totalTransactionsData.total,

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
          this.$t("dashboard.buyPoints"),
          this.$t("dashboard.exchangeCard"),
          this.$t("dashboard.thirdPartyTransactions"),
        ],
        datasets: [
          {
            label: "Data One",
            backgroundColor: ["#ffd046", "#385488", "#288aa6"],
            data: this.totalTransactionsData.totalTransactionsSplit,
          },
        ],
      };
    },
  },
};
</script>
