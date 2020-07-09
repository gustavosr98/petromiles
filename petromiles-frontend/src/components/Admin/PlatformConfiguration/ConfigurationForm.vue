<template>
  <admin-layout>
    <v-row justify="center" class="mx-5">
      <v-col cols="12" md="4" aling="center">
        <v-card class="elevation-0">
          <h3 class="font-weight-bold">{{ $t("configuration.configurationTitle") }}</h3>
          <v-col justify="center" align="center" class="mt-8">
            <v-img :src="platformConfigImg" width="80%" alt="Platform configuration" />
          </v-col>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" class="mt-3">
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, i) in items" :key="i">
            <v-expansion-panel-header class="font-weight-bold my-2">
              {{ item }}
              <template v-slot:actions>
                <v-icon color="primary">$expand</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="caption">
              <platform-interest
                :platformInterest="platformInterests"
                :labels="plaformInterestLabels"
                v-if="i === 0"
              />
              <platform-interest
                :platformInterest="subscriptionBenefits"
                :labels="subscriptionInterestLabels"
                v-if="i === 1"
              />
              <subscription-conditionals :subscriptions="subscriptions" v-if="i === 2" />
              <points-conversion-config :pointsConversion="pointsConversion" v-if="i === 3" />
              <third-party-interest-config :thirdPartyInterest="thirdPartyInterest" v-if="i === 4" />
              <cron-frenquency-config :frequencies="frequencies" v-if="i === 5" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </admin-layout>
</template>

<script>
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import PointsConversionConfig from "@/components/Admin/PlatformConfiguration/PointsConversionConfig";
import ThirdPartyInterestConfig from "@/components/Admin/PlatformConfiguration/ThirdPartyInterestConfig";
import CronFrequencyConfig from "@/components/Admin/PlatformConfiguration/CronFrequencyConfig";
import platformConfigImg from "@/assets/Administration/PlatformConfig.png";
import TransactionType from "@/constants/transaction.js";
import PlatformInterestConfig from "@/components/Admin/PlatformConfiguration/PlatformInterestConfig.vue";
import SubscriptionConditionals from "@/components/Admin/PlatformConfiguration/SubscriptionConditionals";

export default {
  name: "admin-platform-config",
  components: {
    "admin-layout": AdminLayout,
    "points-conversion-config": PointsConversionConfig,
    "third-party-interest-config": ThirdPartyInterestConfig,
    "cron-frenquency-config": CronFrequencyConfig,
    "platform-interest": PlatformInterestConfig,
    "subscription-conditionals": SubscriptionConditionals,
  },
  data() {
    return {
      items: [
        `${this.$t("configuration.platformInterests")}`,
        `${this.$t("configuration.subscriptionBenefits")}`,
        `${this.$t("configuration.subscriptionConditionals")}`,
        `${this.$t("transaction.pointsConversion")}`,
        `${this.$t("configuration.paymentProviderCommissions")}`,
        `${this.$t("configuration.jobFrequencies")}`,
      ],
      platformConfigImg: platformConfigImg,
      platformInterests: [],
      pointsConversion: {},
      thirdPartyInterest: [],
      subscriptionBenefits: [],
      subscriptions: [],
      frequencies: [],
    };
  },
  methods: {
    async loadPlatformInterests() {
      this.platformInterests = await this.$http.get(
        "management/platform-interest/INTEREST"
      );
    },
    async loadSubscriptionBenefits() {
      this.subscriptionBenefits = await this.$http.get(
        "management/platform-interest/EXTRA_POINTS"
      );
    },
    async loadSubscriptions() {
      this.subscriptions = await this.$http.get("suscription");
    },
    async loadPointsConversion() {
      this.pointsConversion = await this.$http.get(
        "payments/one-point-to-dollars"
      );
    },
    async loadThirdPartyInterest() {
      this.thirdPartyInterest = await this.$http.get(
        "management/third-party-interest"
      );
    },
    async loadCronFrequencies() {
      this.frequencies = await this.$http.get("cron");
    },
  },

  computed: {
    plaformInterestLabels: function() {
      return [
        `${this.$tc("common.amount", 0)} ($)`,
        `${this.$t("configuration.percentage")} (%)`,
      ];
    },
    subscriptionInterestLabels: function() {
      return [
        `${this.$t("subscription.extraPoints")}`,
        `${this.$t("configuration.percentage")} (%)`,
      ];
    },
    currentDepositInterest: function() {
      if (this.thirdPartyInterest)
        return this.thirdPartyInterest.find(
          t => t.transactionType == TransactionType.DEPOSIT
        );
      return null;
    },
  },

  mounted() {
    this.loadPlatformInterests();
    this.loadSubscriptionBenefits();
    this.loadSubscriptions();
    this.loadPointsConversion();
    this.loadThirdPartyInterest();
    this.loadCronFrequencies();
  },
};
</script>
