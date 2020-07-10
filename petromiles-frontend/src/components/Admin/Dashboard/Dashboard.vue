<template>
  <div>
    <v-container class="ml-3 pr-0">
      <v-row dense>
        <v-col cols="12" md="3">
          <v-col v-for="(item, i) in pointsData" :key="i" class="py-1">
            <v-card :color="item.color" dark>
              <v-card-title class="headline pb-0">{{ item.title }}</v-card-title>
              <v-card-subtitle class="mt-1 mb-0 pb-0 font-weight-bold"
                >{{ item.points }} {{ $t("payments.points") }}</v-card-subtitle
              >
              <v-card-subtitle class="my-0 py-0"
                >{{ item.dollars }} $</v-card-subtitle
              >
              <v-card-actions>
                <v-btn text to="/admin/transactions">{{
                  $t("common.seeMore")
                }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-col>
        <v-col cols="10" md="9">
          <v-row>
            <v-alert prominent type="info" class="mt-1 ml-4">
              <v-row align="center">
                <v-col class="grow">
                  <strong>{{ $t("dashboard.welcomeBack") }}</strong>
                  {{ $t("dashboard.alertWelcomeMessage") }}:
                  <strong>BuhoCenter</strong>
                  . {{ $t("dashboard.checkMessage") }}
                </v-col>
                <v-col class="shrink">
                  <v-btn color="primary elevation-0" to="/admin/partners">{{
                    $t("navbar.partners")
                  }}</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-row>
          <transaction-graphic
            :transactionData="transactionsData"
            v-if="statistics && showTransactionGraph"
          />
          <without-data
            class="mt-5"
            :usersData="usersData"
            v-if="statistics && !showTransactionGraph && !showBankAccountsGraph"
          />

          <without-transaction
            v-if="statistics && !showTransactionGraph && showBankAccountsGraph"
            :bankAccountsData="bankAccountsData"
            :usersData="usersData"
          />
        </v-col>
      </v-row>

      <with-data
        class="mt-8"
        :bankAccountsData="bankAccountsData"
        :usersData="usersData"
        v-if="statistics && showTransactionGraph && showBankAccountsGraph"
      />
    </v-container>
    <loading-screen :visible="showLoadingScreen"></loading-screen>
  </div>
</template>

<script>
import TransactionsGraph from "@/components/Admin/Dashboard/TransactionsGraphic.vue";
import WithoutTransaction from "@/components/Admin/Dashboard/DashboardWithoutTransaction.vue";
import WithoutData from "@/components/Admin/Dashboard/DashboardWithoutData.vue";
import WithData from "@/components/Admin/Dashboard/DashboardWithData.vue";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";
export default {
  components: {
    "transaction-graphic": TransactionsGraph,
    "without-transaction": WithoutTransaction,
    "without-data": WithoutData,
    "with-data": WithData,
    "loading-screen": LoadingScreen,
  },
  data() {
    return {
      statistics: null,
      transactionsState: [],
      pointsDetails: null,
      showLoadingScreen: true,
    };
  },
  async mounted() {
    try {
      await this.loadPointsDetails();
      await this.loadStatistics(); 
    } catch (error) {
      console.log(error);
    }
    finally{
      this.showLoadingScreen = false;
    }       
  },
  methods: {
    async loadStatistics() {
      this.statistics = await this.$http.get("management/statistics");
    },
    async loadPointsDetails() {
      this.pointsDetails = await this.$http.get("management/points-details");
    },
    buildTotalTransactionList() {
      const transactions = this.statistics.transactions;

      return [
        transactions.addPoints.total,
        transactions.exchangePoints.total,
        transactions.thirdPartyClient.total,
      ];
    },
  },
  computed: {
    pointsData: function() {
      if (this.pointsDetails)
        return [
          {
            title: this.$t("common.total"),
            color: "primary",
            points: this.pointsDetails.total.points,
            dollars: this.pointsDetails.total.dollars,
          },
          {
            title: "Purchased",
            color: "#1F7087",
            points: this.pointsDetails.purchasedPoints.points,
            dollars: this.pointsDetails.purchasedPoints.dollars,
          },
          {
            title: "Redeemed ",
            color: "secondary",
            points: this.pointsDetails.redeemedPoints.points,
            dollars: this.pointsDetails.redeemedPoints.dollars,
          },
        ];

      return [];
    },
    transactionsData: function() {
      const transactions = this.statistics.transactions;
      if (this.statistics) {
        const totalValid =
          transactions.addPoints.totalValid +
          transactions.exchangePoints.totalValid +
          transactions.thirdPartyClient.totalValid;

        const totalInvalid =
          transactions.addPoints.totalInvalid +
          transactions.exchangePoints.totalInvalid +
          transactions.thirdPartyClient.totalInvalid;

        const totalPending =
          transactions.addPoints.totalPending +
          transactions.exchangePoints.totalPending +
          transactions.thirdPartyClient.totalPending;

        const states = [];

        states.push(totalValid);
        states.push(totalPending);
        states.push(totalInvalid);

        return { total: this.buildTotalTransactionList(), states };
      }
      return {};
    },
    showTransactionGraph: function() {
      const transactions = this.statistics.transactions;

      if (this.statistics) {
        let total = 0;
        const totalTransaccions = this.buildTotalTransactionList();
        totalTransaccions.map(amount => (total += amount));
        if (total > 0) return true;
      }

      return false;
    },
    showBankAccountsGraph: function() {
      const accountsData = this.statistics.clientBankAccounts;
      if (accountsData.total > 0) return true;
      return false;
    },
    usersData: function() {
      const users = this.statistics.users;
      const clients = [];
      clients.push(users.clients.totalActive);
      clients.push(users.clients.totalBlocked);

      const admins = [];
      admins.push(users.admins.totalActive);
      admins.push(users.admins.totalBlocked);

      return {
        clients,
        admins,
        totalClients: users.clients.totalClients,
        totalAdmins: users.admins.totalAdmins,
      };
    },
    bankAccountsData: function() {
      const accountsData = this.statistics.clientBankAccounts;
      const accounts = [
        accountsData.totalValid,
        accountsData.totalPending,
        accountsData.totalInvalid,
      ];

      return {
        accounts,
        total: accountsData.total,
      };
    },
  },
};
</script>
