<template>
  <client-layout>
    <v-row>
      <v-main class="pa-3">
        <v-row align="center" justify="center">
          <v-col cols="2">
            <router-link to="/user-subscription" style="text-decoration: none">
              <v-icon x-large class="ml-3">mdi-arrow-left-thick</v-icon>
            </router-link>
          </v-col>
          <v-col cols="8">
            <!-- Title Page -->
            <div class="text-center">
              <h1
                class="secondary--text text--darken-1"
              >{{ $t("transaction-type.subscriptionPayment") }}</h1>
            </div>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <!-- Premium Level Description -->
          <v-col cols="12" md="6" lg="4">
            <div class="text-center">
              <v-row align="center" justify="center">
                <v-col>
                  <h1 class="primary--text">{{ $t("subscription.premiumLevel") }}</h1>
                  <v-row align="center" justify="center">
                    <v-col cols="11" lg="12">
                      <v-card class="mx-auto pt-8" max-width="400" elevation="10">
                        <v-img
                          class="white--text align-end"
                          contain
                          height="330px"
                          src="@/assets/membership/premium.png"
                          lazy-src="@/assets/general/spinner.gif"
                        ></v-img>
                        <v-card-text class="text--primary">
                          <div class="pb-3">
                            <b>
                              <h1>{{ $t("subscription.cost") }}: ${{ cost }}</h1>
                            </b>
                          </div>
                          <p>
                            {{
                            $t("subscription.descriptionPremium", { percentage })
                            }}
                          </p>
                          <p>
                            <b>{{ $t("subscription.becomePremium") }}</b>
                          </p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <!-- Transaction Information Form -->
          <v-col cols="12" md="6" lg="4">
            <div>
              <v-row align="center" justify="center">
                <v-col cols="11" lg="12">
                  <h1
                    class="text-center primary--text"
                  >{{ $t("subscription.transactionInformation") }}</h1>
                  <v-card class="mx-auto mt-3" max-width="344" elevation="10">
                    <v-card-text>
                      <h1 class="text-center pb-4 secondary--text text--darken-1">PetroMiles</h1>
                      <v-divider></v-divider>
                      <br />
                      <div class="text--primary">
                        <p>
                          {{ $t("invoice.transactionType") }}:
                          <b>
                            {{
                            $t("transaction-type.subscriptionPayment")
                            }}
                          </b>
                        </p>
                        <p>
                          {{ $t("subscription.description") }}:
                          <b>{{ $t("subscription.levelAdquisition") }}</b>
                        </p>
                        <p>
                          {{ $t("subscription.level") }}:
                          <b>{{ $t("interest.premiumConfig") }}</b>
                        </p>
                        <v-divider></v-divider>
                        <p class="mt-4 primary--text body-1">
                          <b>{{ $t("subscription.bankAccountInformation") }}:</b>
                        </p>
                        <ul class="mt-n3 mb-3">
                          <li>
                            {{ $t("bank-account-properties.nickname") }}:
                            <b
                              class="secondary--text text--darken-1"
                            >
                              {{
                              nickname
                              }}
                            </b>
                          </li>
                          <li>
                            {{ $t("subscription.holderName") }}:
                            <b>{{ fullName }}</b>
                          </li>
                          <li>
                            {{ $t("subscription.bankName") }}:
                            <b>{{ bank }}</b>
                          </li>
                          <li>
                            {{ $t("bank-account-properties.accountNumber") }}:
                            <b>{{ bankAccountNumber }}</b>
                          </li>
                        </ul>
                        <v-divider></v-divider>
                        <h2 class="pt-3">
                          {{ $t("subscription.cost") }}:
                          <b
                            class="green--text text--darken-1"
                          >${{ cost }}</b>
                        </h2>
                      </div>
                    </v-card-text>
                    <v-expand-transition>
                      <div v-if="isPremium">
                        <v-divider></v-divider>
                        <v-card-text>
                          <b>
                            <h4
                              class="error--text text--darken-1"
                            >{{ $t("subscription.premiumAlready") }}</h4>
                          </b>
                        </v-card-text>
                      </div>
                    </v-expand-transition>
                  </v-card>
                  <v-form v-model="formValidity">
                    <v-row align="center" justify="center">
                      <v-col cols="9" sm="6" md="6" lg="8">
                        <v-select
                          v-model="selectedBankAccount"
                          :label="$tc('navbar.bankAccount', 0)"
                          append-outer-icon="mdi-bank"
                          :items="bankAccounts"
                          item-value="idBankAccount"
                          :error-messages="selectedBankAccountErrors"
                          :loading="loadingBankAccounts"
                          :disabled="
                            loadingBankAccounts || loading || isPremium
                          "
                        >
                          <template
                            slot="selection"
                            slot-scope="data"
                          >{{ data.item.nickname }} - {{ data.item.last4 }}</template>
                          <template
                            slot="item"
                            slot-scope="data"
                          >{{ data.item.nickname }} - {{ data.item.last4 }}</template>
                        </v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                  <v-row align="center" justify="center">
                    <v-col cols="4" sm="2" md="4" lg="4">
                      <v-btn
                        class="mb-3"
                        dark
                        color="primary"
                        @click="submitButton"
                        :loading="loading"
                        :disabled="isPremium"
                      >
                        <span>{{ $t("subscription.subscribe") }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <!-- Applies for Subscription Payment -->
          <v-col offset="0" md="12" cols="12" lg="4">
            <div>
              <v-row align="center" justify="center">
                <h1
                  class="text-center primary--text mt-3 mb-n1 pr-6"
                >{{ $t("subscription.howItWorks") }}</h1>
                <v-col cols="10" lg="10" class="mr-sm-8 mt-1">
                  <v-card class="mx-auto px-2" max-width="380" elevation="10">
                    <v-card-text class="black--text">
                      <p>
                        <b>
                          <h3>{{ $t("subscription.premiumApplies") }}</h3>
                        </b>
                      </p>
                      <ul>
                        <li>
                          {{
                          $t("subscription.premiumPointsWontAppearInstantly")
                          }}
                        </li>
                        <li>
                          {{
                          $t("subscription.premiumPointsPurchaseDelayLabel")
                          }}
                        </li>
                        <li>{{ $t("subscription.premiumPurchaseEmail") }}</li>
                        <li>
                          {{
                          $t("subscription.premiumProccessedPurchaseEmail")
                          }}
                        </li>
                      </ul>
                      <br />
                      <h3>
                        {{ $t("subscription.premiumIssues") }}:
                        <span
                          class="secondary--text text--darken-1"
                        >support@petromiles.com</span>
                      </h3>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <!-- Transaction Complete Dialog -->
          <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="50%">
              <v-card>
                <v-card-title class="headline">{{ $t("subscription.thanksForPayingSubscription") }}</v-card-title>
                <v-card-text>{{ $t("subscription.transactionValidateSubscription") }}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" dark :to="{ name: comeBackRoute }">{{ $t("common.ok") }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>

          <!-- Confirmation  Dialog -->
          <v-row justify="center">
            <v-dialog v-model="areYouSureDialog" persistent max-width="50%">
              <v-card>
                <v-card-title class="headline">{{ $t("common.areYouSure") }}</v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="error"
                    dark
                    @click="areYouSureDialog = false"
                  >{{ $t("common.cancel") }}</v-btn>
                  <v-btn color="success" dark @click="paySubscription">{{ $t("common.yes") }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-row>
      </v-main>
    </v-row>
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import { states } from "@/constants/state";
import { mapState } from "vuex";
import bankAccountsMixin from "@/mixins/load/bank-accounts.mixin.js";
import buyPointsValidationMixin from "@/mixins/validation-forms/buy-points.mixin.js";
import clientRoutes from "@/router/clientRoutes";
import membershipConstants from "@/constants/memberships";

export default {
  name: "user-subscription-purchase",
  mixins: [bankAccountsMixin, buyPointsValidationMixin],

  components: {
    "client-layout": ClientLayout,
  },
  data() {
    return {
      formValidity: false,
      bankAccounts: [],
      loading: false,
      bankAccountNumber: null,
      selectedBankAccount: null,
      loadingBankAccounts: true,
      firstName: "",
      lastName: "",
      bank: "",
      nickname: null,
      subscriptionCost: null,
      areYouSureDialog: false,
      subscription: { name: "PREMIUM" },
      comeBackRoute: clientRoutes.TRANSACTION_LIST.name,
      dialog: false,
      premiumCost: null,
      membership: "",
      memberships: {},
      isPremium: false,
      percentage: null,
      cost: null,
    };
  },
  async mounted() {
    await this.loadBankAccounts();

    if (this.user) {
      this.firstName = this.user.details.firstName;
      this.lastName = this.user.details.lastName;
    }
    this.premiumCost = await this.$http.get("/suscription/cost/PREMIUM");
    this.cost = this.premiumCost.cost;

    this.infoPremium = await this.$http.get("/suscription/information/premium");
    this.percentage = this.infoPremium.percentage;

    this.membership = await this.$http.get("suscription/actual");
    this.memberships = membershipConstants;

    if (this.membership.name !== this.memberships.BASIC) {
      this.isPremium = true;
    }
  },
  methods: {
    async submitButton() {
      this.$v.$touch();
      if (!this.$v.selectedBankAccount.$invalid) {
        this.areYouSureDialog = true;
      }
    },
    async paySubscription() {
      this.areYouSureDialog = false;
      this.loading = true;
      this.$http
        .post("/suscription/upgrade-to-premium", {
          idBankAccount: this.selectedBankAccount,
          costSuscription: this.cost * 100,
        })
        .then(res => {
          this.dialog = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  computed: {
    ...mapState("auth", ["user"]),
    fullName: function() {
      if (!this.user) return false;
      return this.user.details.firstName + " " + this.user.details.lastName;
    },
  },
  watch: {
    selectedBankAccount: function() {
      for (var i = 0; i < this.bankAccounts.length; i++) {
        if (
          this.bankAccounts[i].idClientBankAccount === this.selectedBankAccount
        ) {
          const account = this.bankAccounts[i];
          this.bankAccountNumber = account.last4;
          this.bank = account.bank;
          this.nickname = account.nickname;
        }
      }
    },
  },
};
</script>
