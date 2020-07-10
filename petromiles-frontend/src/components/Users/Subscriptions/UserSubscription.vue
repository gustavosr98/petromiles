<template>
  <v-app>
    <div></div>
    <v-main class="pa-3">
      <v-row align="center" justify="center">
        <v-col cols="2">
          <router-link class="" to="/profile" style="text-decoration: none">
            <v-icon x-large> mdi-arrow-left-thick </v-icon>
          </router-link>
        </v-col>
        <v-col cols="8">
          <div class="text-center">
            <h1 class=" secondary--text text--darken-1">
              {{ $t("subscription.premiumFamily") }}
            </h1>
          </div>
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row align="center" justify="center">
        <v-col cols="11" sm="10" lg="8">
          <v-simple-table align="center" justify="center">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">
                    {{ $t("subscription.premiumBenefits") }}
                  </th>
                  <th class="text-center">
                    {{ $t("subscription.premiumBasicTable") }}
                  </th>
                  <th class="text-center">
                    {{ $t("interest.premiumConfig") }}
                  </th>
                  <th class="text-center">
                    {{ $t("subscription.premiumGoldTable") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td class="benefitDescription">
                    {{
                      $t("subscription.premiumMorePointsTable", { percentage })
                    }}
                    <br />
                    {{ $t("subscription.premiumForEachPayment") }}
                  </td>
                  <td></td>
                  <td>
                    <v-icon color="green">mdi-check-circle</v-icon>
                  </td>
                  <td></td>
                </tr>
                <tr class="text-center">
                  <td class="benefitDescription">
                    {{
                      $t("subscription.goldMorePointsTable", {
                        percentageGold,
                      })
                    }}
                    <br />
                    {{ $t("subscription.premiumForEachPayment") }}
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <v-icon color="green">mdi-check-circle</v-icon>
                  </td>
                </tr>
                <tr class="text-center">
                  <td class="benefitDescription">
                    {{ $t("subscription.premiumExtraPoints", { extra }) }}
                    <br />
                    {{ $t("subscription.premiumForEachPayment") }}
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <v-icon color="green">mdi-check-circle</v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <!-- Premium Membership Description -->
        <v-col cols="11" sm="5" lg="4">
          <v-card
            class="mx-auto mt-6 py-8"
            max-width="400"
            elevation="10"
            align="center"
            justify="center"
          >
            <v-img
              class="white--text align-end"
              height="335px"
              contain
              src="@/assets/membership/premium.png"
              lazy-src="@/assets/general/spinner.gif"
            ></v-img>

            <v-card-subtitle class="pb-5 primary--text">
              <h1>{{ $t("interest.premiumConfig") }}</h1>
            </v-card-subtitle>

            <v-card-text class="text--primary">
              <div class="mb-3">
                <h2>
                  <b>{{ $t("subscription.cost") }}: ${{ cost }}</b>
                </h2>
              </div>
              <p class="mb-n1">
                {{ $t("subscription.descriptionPremium", { percentage }) }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-row align="center" justify="center">
                <router-link
                  to="/user-subscription-purchase"
                  class="text-decoration-none"
                >
                  <v-btn dark color="primary">{{
                    $t("subscription.btnAcquireNow")
                  }}</v-btn>
                </router-link>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <!-- Gold membership Description -->
        <v-col cols="11" sm="5" lg="4">
          <v-card
            class="mx-auto mt-6 py-8"
            max-width="400"
            elevation="10"
            align="center"
            justify="center"
          >
            <v-img
              class="white--text align-end"
              height="350px"
              contain
              src="@/assets/membership/gold.png"
              lazy-src="@/assets/general/spinner.gif"
            ></v-img>
            <v-card-subtitle class="secondary--text text--darken-1">
              <h1>
                <b>{{ $t("interest.goldConfig") }}</b>
              </h1>
            </v-card-subtitle>
            <v-card-text class="text--primary">
              <p class="mb-n1">
                {{ $t("subscription.goldDescription", { incomes }) }}
              </p>
            </v-card-text>

            <v-card-actions>
              <v-row align="center" justify="center">
                <router-link to="/buy-points" class="text-decoration-none">
                  <v-btn dark color="primary">{{
                    $t("subscription.btnWantIt")
                  }}</v-btn>
                </router-link>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import { states } from "@/constants/state";
import { mapState } from "vuex";

export default {
  name: "user-subscription-info",

  data() {
    return {
      infoPremium: null,
      premiumCost: null,
      percentage: null,
      infoGold: null,
      extra: null,
      percentageGold: null,
      incomes: null,
      cost: null,
    };
  },
  async mounted() {
    this.premiumCost = await this.$http.get("/suscription/cost/PREMIUM");
    this.cost = this.premiumCost.cost;
    this.infoPremium = await this.$http.get("/suscription/information/premium");
    this.infoGold = await this.$http.get("/suscription/information/gold");
    this.percentage = this.infoPremium.percentage;
    this.incomes = this.infoGold.amountUpgrade;
    this.percentageGold = this.infoGold.percentage;
    this.extra = this.infoGold.points;
  },
};
</script>
