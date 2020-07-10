<template>
  <div>
    <client-layout>
      <client-points></client-points>
      <v-row class="pa-9">
        <h3 class="px-2">
          {{ $t("dashboard.transactionsStats") }}
        </h3>
        <v-row align="center" justify="center">
          <v-col cols="11" md="4" sm="4" lg="3" xs="6">
            <div class="mx-1">
              <TotalTransactionsChart
                v-if="statistics"
                :totalTransactionsData="totalTransactionsData"
              />
            </div>
          </v-col>
          <v-col cols="11" sm="4" lg="3" xs="6">
            <div class="mx-1">
              <AddPointsChart v-if="statistics" :addPointsData="addPointsData" />
            </div>
          </v-col>
          <v-col cols="11" sm="4" lg="3" xs="6">
            <div class="mx-1">
              <ExchangePointsChart
                v-if="statistics"
                :exchangePointsData="exchangePointsData"
              />
            </div>
          </v-col>
          <v-col cols="11" sm="4" lg="3" xs="6">
            <div class="mx-1">
              <ThirdPartyChart
                v-if="statistics"
                :thirdPartyData="thirdPartyData"
              />
            </div>
          </v-col>
        </v-row>
      </v-row>
      <div class="px-8">
        <h3 class="">
          {{ $t("dashboard.transactionsBank") }}
        </h3>
      </div>
      <v-row align="center" justify="center">
        <v-col cols="10" sm="4" lg="3" xs="6">
          <div class="mx-1 pb-4">
            <BankAccountsChart v-if="statistics" :bankAccounts="bankAccounts" />
          </div>
        </v-col>
      </v-row>
      <div class="px-8">
        <h3 class="pt-3">
          {{ $t("dashboard.enjoyServices") }}
        </h3>
      </div>
      <v-row class="px-9" justify="center" align="center">
        <v-col justify="center" align="center">
          <buy-points-card></buy-points-card>
        </v-col>
        <v-col justify="center" align="center">
          <exchange-card></exchange-card>
        </v-col>
        <v-col justify="center" align="center">
          <membership-card></membership-card>
        </v-col>
      </v-row>
    </client-layout>
    <loading-screen :visible="showLoadingScreen"></loading-screen>
  </div>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import ClientCurrentPoints from "@/components/Client/Dashboard/ClientCurrentPoints";
import ExchangeCard from "@/components/Client/Dashboard/ExchangeCard";
import MembershipCard from "@/components/Client/Dashboard/MembershipCard";
import BuyPointsCard from "@/components/Client/Dashboard/BuyPointsCard";
import AddPointsChart from "@/components/Client/Dashboard/ClientCharts/Transactions/AddPointsChart";
import ExchangePointsChart from "@/components/Client/Dashboard/ClientCharts/Transactions/ExchangePointsChart";
import ThirdPartyChart from "@/components/Client/Dashboard/ClientCharts/Transactions/ThirdPartyChart";
import TotalTransactionsChart from "@/components/Client/Dashboard/ClientCharts/Transactions/TotalTransactionsChart";
import BankAccountsChart from "@/components/Client/Dashboard/ClientCharts/BankAccounts/BankAccountsChart";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";
export default {
  name: "client-dashboard",
  components: {
    "client-layout": ClientLayout,
    "client-points": ClientCurrentPoints,
    "exchange-card": ExchangeCard,
    "membership-card": MembershipCard,
    "buy-points-card": BuyPointsCard,
    "loading-screen": LoadingScreen,
    AddPointsChart,
    ExchangePointsChart,
    ThirdPartyChart,
    TotalTransactionsChart,
    BankAccountsChart,
  },
  data() {
    return {
      statistics: null,
      addPointsTransactions: null,
      exchangeTransactions: null,
      thirdPartyTransactions: null,
      clientBankAccounts: null,
      showLoadingScreen: true,
    };
  },
  mounted() {
    this.loadStatistics();
  },
  methods: {
    async loadStatistics() {
      this.statistics = await this.$http.get("management/statistics").finally(() => {
        this.showLoadingScreen = false;
      });
      this.addPointsTransactions = this.statistics.transactions.addPoints;
      this.exchangeTransactions = this.statistics.transactions.exchangePoints;
      this.thirdPartyTransactions = this.statistics.transactions.thirdPartyClient;
      this.clientBankAccounts = this.statistics.clientBankAccounts;      
    },
  },
  computed: {
    addPointsData: function() {
      const addData = this.addPointsTransactions;
      const addTransactions = [
        addData.totalValid,
        addData.totalInvalid,
        addData.totalPending,
      ];

      return {
        addTransactions,
        total: addData.total,
      };
    },

    exchangePointsData: function() {
      const exchangeData = this.exchangeTransactions;
      const exchangePointsTransactions = [
        exchangeData.totalValid,
        exchangeData.totalInvalid,
        exchangeData.totalPending,
      ];

      return {
        exchangePointsTransactions,
        total: exchangeData.total,
      };
    },

    thirdPartyData: function() {
      const thirPartyData = this.thirdPartyTransactions;
      const ThirdsPartyTransactions = [
        thirPartyData.totalValid,
        thirPartyData.totalInvalid,
        thirPartyData.totalPending,
      ];

      return {
        ThirdsPartyTransactions,
        total: thirPartyData.total,
      };
    },

    totalTransactionsData: function() {
      const totalTransactions = this.statistics;
      const addData = this.addPointsTransactions;
      const exchangeData = this.exchangeTransactions;
      const thirPartyData = this.thirdPartyTransactions;

      const totalTransactionsSplit = [
        addData.total,
        exchangeData.total,
        thirPartyData.total,
      ];

      return {
        totalTransactionsSplit,
        total: totalTransactions.transactions.total,
      };
    },

    bankAccounts: function() {
      const banks = this.clientBankAccounts;
      const bankAccountsOrder = [
        banks.totalValid,
        banks.totalInvalid,
        banks.totalPending,
      ];
      return {
        bankAccountsOrder,
        total: banks.total,
      };
    },
  },
};
</script>
