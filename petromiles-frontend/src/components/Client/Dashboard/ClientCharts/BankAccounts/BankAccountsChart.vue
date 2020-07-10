<template>
  <div>
    <v-card max-width="500" class="px-5 py-3" :elevation="4" color="#f0f5ff">
      <v-card-text>
        <h2 class="text-center black--text">
          {{ $t("dashboard.bankAccounts") }}
        </h2>
      </v-card-text>
      <v-divider></v-divider>
      <div class="py-2">
        <Pie :chartData="chartData" :options="options"></Pie>
      </div>
      <h5>{{ $t("dashboard.bankAccountsTotal") }} {{ totalBanks }}</h5>
    </v-card>
  </div>
</template>

<script>
import Pie from "@/components/General/Graphics/Pie";
export default {
  props: {
    bankAccounts: { type: Object, required: true },
  },
  name: "bank-accounts-chart",
  components: {
    Pie,
  },
  data() {
    return {
      totalBanks: this.bankAccounts.total,
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
          this.$t("dashboard.deleteBlock"),
          this.$t("state-name.verifying"),
        ],
        datasets: [
          {
            backgroundColor: ["#4CAF50", "#df323b", "#2196F3"],
            data: this.bankAccounts.bankAccountsOrder,
          },
        ],
      };
    },
  },
};
</script>
