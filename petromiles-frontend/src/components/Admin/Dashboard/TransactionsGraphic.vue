<template>
  <v-row>
    <v-col cols="12" class="pb-0">
      <h3>{{$t('dashboard.allTransactions')}}</h3>
    </v-col>
    <v-col cols="6" md="4" class="pt-0">
      <bar-chart :datacollection="datacollection" :options="barOptions" />
    </v-col>
    <v-col cols="6" md="4" class="pt-0">
      <doughnut-example :chart-data="chartData" :options="options"></doughnut-example>
    </v-col>
    <v-col cols="12" md="4" align="center">
      <v-card class="elevation-1 py-4 mt-9">
        <div v-for="(label, i) in labels" :key="i">
          <p class="mb-1">{{ label.total }} {{ label.title }}</p>
        </div>
        <h3 class="mb-4">Total {{ transactionTotal }}</h3>
        <v-btn
          small
          color="primary"
          class="elevation-0"
          to="/admin/transactions"
        >{{$t('common.moreDetails')}}</v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Bars from "@/components/General/Graphics/Bars.vue";
import DoughnutExample from "@/components/General/Graphics/Doughnut.vue";

export default {
  props: {
    transactionData: { type: Object, required: true },
  },
  components: {
    "bar-chart": Bars,
    "doughnut-example": DoughnutExample,
  },
  data() {
    return {
      chartData: {
        labels: [
          this.$t("dashboard.purchase"),
          this.$t("transaction-type.withdrawal"),
          this.$t("dashboard.external"),
        ],
        datasets: [
          {
            backgroundColor: ["#1B3D6E", "#FCB526", "#1F7087"],
            data: this.transactionData.total,
          },
        ],
      },
      options: {
        animation: {
          animateRotate: true,
        },
      },
      datacollection: {
        labels: [
          this.$t("state-name.valid"),
          this.$t("state-name.verifying"),
          this.$t("state-name.invalid"),
        ],
        datasets: [
          {
            label: this.$t("common.total"),
            backgroundColor: "rgba(27, 61, 110, 1)",
            borderColor: "#1B3D6E",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "#FCB526",
            data: this.transactionData.states,
          },
        ],
      },
      barOptions: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }],
        },
        responsive: true,
      },
      labels: [
        {
          title: this.$t("dashboard.purchaseTransactions"),
          total: this.transactionData.total[0],
        },
        {
          title: this.$t("dashboard.withdrawalTransactions"),
          total: this.transactionData.total[1],
        },
        {
          title: this.$t("dashboard.externalTransaction"),
          total: this.transactionData.total[2],
        },
      ],
    };
  },
  computed: {
    transactionTotal: function() {
      let total = 0;
      this.transactionData.total.map(amount => (total += amount));
      return total;
    },
  },
};
</script>
