<template>
  <admin-layout>
    <v-row align="center" justify="center">
      <v-col cols="12" md="10" aling="center">
        <h3 class="font-weight-light">{{$t("configuration.configurationTitle")}}</h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" md="10">
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, i) in items" :key="i">
            <v-expansion-panel-header class="font-weight-bold">
              {{ item }}
              <template v-slot:actions>
                <v-icon color="primary">$expand</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="caption">
              <platform-interest-config :platformInterests="platformInterests" v-if="i ===0 " />
              <points-conversion-config :pointsConversion="pointsConversion" v-if="i ===1" />
              <third-party-interest-config :thirdPartyInterest="thirdPartyInterest" v-if="i ===2 " />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </admin-layout>
</template>

<script>
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import PlatformInterestConfig from "@/components/Admin/PlatformConfiguration/PlatformInterestConfig";
import PointsConversionConfig from "@/components/Admin/PlatformConfiguration/PointsConversionConfig";
import ThirdPartyInterestConfig from "@/components/Admin/PlatformConfiguration/ThirdPartyInterestConfig";

export default {
  name: "admin-platform-config",
  components: {
    "admin-layout": AdminLayout,
    "platform-interest-config": PlatformInterestConfig,
    "points-conversion-config": PointsConversionConfig,
    "third-party-interest-config": ThirdPartyInterestConfig,
  },
  data() {
    return {
      items: ["Platform Interest", "Points conversion", "Third Party Interest"],
      platformInterests: null,
      pointsConversion: null,
      thirdPartyInterest: null,
    };
  },
  methods: {
    async loadPlatformInterests() {
      this.platformInterests = await this.$http.get(
        "management/platform-interest"
      );
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
  },

  mounted() {
    this.loadPlatformInterests();
    this.loadPointsConversion();
    this.loadThirdPartyInterest();
  },
};
</script>
