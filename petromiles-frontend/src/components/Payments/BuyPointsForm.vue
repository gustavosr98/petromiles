<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="10">
        <!-- Content -->
        <v-row justify="center" align="center">
          <!-- Phrase -->
          <v-col cols="12">
            <h3 class="text-center">{{ $t("buy-points-form.letsEarnPoints") }}</h3>
          </v-col>

          <!-- Image -->

          <v-col xs="10" sm="10" md="4" justify="center" align="center" class="pt-lg-12">
            <v-img :src="piggyImage" alt="Piggy coins savings" />
          </v-col>

          <!-- Form -->
          <v-col cols="12" md="6">
            <v-card class="py-6">
              <v-form ref="buy-points-form" v-model="formValidity">
                <v-row justify="center">
                  <v-col cols="8">
                    <v-text-field
                      v-model="$v.points.$model"
                      :label="$t('payments.points')"
                      append-icon="mdi-coins"
                      clearable
                      @change="$v.points.$touch()"
                      @blur="$v.points.$touch()"
                      :error-messages="pointsErrors"
                      :disabled="loading"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="8">
                    <v-text-field
                      :value="Math.round(costWithInterests * 100) / 100"
                      :label="$t('payments.totalCost')"
                      append-icon="mdi-cash"
                      :disabled="true"
                      return-masked-value
                      mask="###.###.###-##"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center" v-if="this.subscription.name !== 'BASIC'">
                  <v-col cols="8" xs="8" md="4">
                    <v-text-field
                      :value="extraPoints"
                      :label="labelExtraPoints"
                      append-icon="add_circle"
                      :disabled="true"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8" xs="8" md="4">
                    <v-text-field
                      :value="totalPoints"
                      :label="$t('payments.totalPointsSum')"
                      append-icon="account_balance_wallet"
                      :disabled="true"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="8">
                    <v-select
                      v-model="selectedBankAccount"
                      :label="$tc('navbar.bankAccount', 0)"
                      append-outer-icon="mdi-bank"
                      :items="bankAccounts"
                      item-value="idClientBankAccount"
                      @change="$v.points.$touch()"
                      @blur="$v.points.$touch()"
                      :error-messages="selectedBankAccountErrors"
                      :loading="loadingBankAccounts"
                      :disabled="loadingBankAccounts || loading"
                    >
                      <template slot="selection" slot-scope="data">
                        {{ data.item.nickname }} -
                        {{ data.item.last4 }}
                      </template>
                      <template slot="item" slot-scope="data">
                        {{ data.item.nickname }} -
                        {{ data.item.last4 }}
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" class="text-center">
                    <v-btn
                      @click="submitButton"
                      class="primary"
                      :loading="loading"
                      dark
                    >{{ $t("buy-points-form.getPoints") }}</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-col>
        </v-row>

        <!-- Final Dialog -->
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="50%">
            <v-card>
              <v-card-title class="headline">
                {{
                $t("buy-points-form.thanksForBuying")
                }}
              </v-card-title>
              <v-card-text>
                {{
                $t("buy-points-form.transactionToValidate")
                }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" dark :to="{ name: comeBackRoute }">
                  {{
                  $t("common.ok")
                  }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <!-- Confirmation  Dialog -->
        <v-row justify="center">
          <v-dialog v-model="areYouSureDialog" persistent max-width="50%">
            <v-card>
              <v-card-title class="headline">
                {{
                $t("common.areYouSure")
                }}
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn color="error" dark @click="areYouSureDialog = false">
                  {{
                  $t("common.cancel")
                  }}
                </v-btn>
                <v-btn color="success" dark @click="buyPoints">
                  {{
                  $t("common.yes")
                  }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
    <!-- Pdf template -->
    <v-row>
      <payments-invoice
        @pdfWasCreated="pdfWasCreated"
        :transaction="transaction"
        :typeInvoice="typeInvoice"
        v-if="paymentIsReady"
      />
    </v-row>
    <loading-screen :visible="showLoadingScreen"></loading-screen>
  </div>
</template>

<script>
import piggyImage from "@/assets/Transaction/BuyPoints.png";
import buyPointsValidationMixin from "@/mixins/validation-forms/buy-points.mixin.js";
import bankAccountsMixin from "@/mixins/load/bank-accounts.mixin.js";
import clientRoutes from "@/router/clientRoutes";
import PaymentInvoice from "@/components/Payments/PaymentInvoice";
import typeTransaction from "@/constants/transaction";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";

export default {
  name: "buy-points-form",
  mixins: [buyPointsValidationMixin, bankAccountsMixin],
  components: {
    "payments-invoice": PaymentInvoice,
    "loading-screen": LoadingScreen,
  },
  data: function() {
    return {
      piggyImage: piggyImage,
      formValidity: false,
      points: null,
      cost: 0,
      onePointToDollars: 0,
      loading: false,
      bankAccounts: [],
      selectedBankAccount: null,
      loadingBankAccounts: true,
      interests: [],
      dialog: false,
      areYouSureDialog: false,
      comeBackRoute: clientRoutes.TRANSACTION_LIST.name,
      paymentIsReady: false,
      transaction: {},
      typeInvoice: typeTransaction.DEPOSIT,
      subscription: {},
      infoSubscription: {},
      showLoadingScreen: true,
    };
  },
  computed: {
    rawCost() {
      return Math.round(this.points * this.onePointToDollars * 10000) / 10000;
    },
    costWithInterests() {
      if (this.points) {
        let result = this.rawCost;
        this.interests.map(i => {
          result = result + this.rawCost * i.percentage + i.amount / 100;
        });
        return Math.round(result * 10000) / 10000;
      } else return "0.00";
    },
    labelExtraPoints() {
      return this.subscription.name === "PREMIUM"
        ? this.$t("transaction.subscriptionExtraPremium")
        : this.$t("transaction.subscriptionExtraGold");
    },
    extraPoints() {
      if (this.points) {
        if (this.subscription.name === "PREMIUM") {
          return Math.round(
            this.points * (this.infoSubscription.percentage / 100)
          );
        } else if (this.subscription.name === "GOLD") {
          return Math.round(
            this.points * (this.infoSubscription.percentage / 100) +
              this.infoSubscription.points
          );
        }
      }
      return "0";
    },
    totalPoints() {
      if (this.points) {
        return parseInt(this.points) + parseInt(this.extraPoints);
      } else return "0";
    },
  },
  async mounted() {
    try {
      await this.loadBankAccounts();
      await this.loadRate();
      await this.loadInterests();
      await this.loadSubscription();  
    } catch (error) {
      console.log(error);
    }
    finally{
      this.showLoadingScreen = false;
    }
      
  },
  methods: {
    async submitButton() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.areYouSureDialog = true;
      }
    },
    async buyPoints() {
      this.areYouSureDialog = false;
      this.loading = true;
      this.$http
        .post("/payments/buy-points", {
          idClientBankAccount: this.selectedBankAccount,
          amount: Math.round(this.rawCost * 10000) / 100,
          amountToCharge: Math.round(this.costWithInterests * 10000) / 100,
          points: this.points,
          subscriptionName: this.subscription.name.toLowerCase(),
          infoSubscription: this.infoSubscription,
        })
        .then(res => {
          this.transaction = res;
          this.paymentIsReady = true;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    async loadSubscription() {
      this.subscription = await this.$http.get("/suscription/actual");
      if (this.subscription.name !== "BASIC") {
        this.infoSubscription = await this.$http.get(
          `/suscription/information/${this.subscription.name.toLowerCase()}`
        );
      }
    },
    async loadRate() {
      this.onePointToDollars = (
        await this.$http.get("/payments/one-point-to-dollars")
      ).onePointEqualsDollars;
    },
    async loadInterests() {
      this.interests = await this.$http.get("/payments/interests/deposit/buy");
    },
    pdfWasCreated() {
      this.dialog = true;
      this.loading = false;
    },
  },
};
</script>
