<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="10">
        <!-- Content -->
        <v-row justify="center" align="center">
          <!-- Phrase -->
          <v-col cols="12">
            <h3 class="text-center">{{ $t("exchange-points-form.letsEarnDollars") }}</h3>
          </v-col>

          <!-- Image -->

          <v-col xs="10" sm="10" md="4" justify="center" align="center" class="pt-lg-12">
            <v-img :src="makeItRainImage" alt="Change points for money" />
          </v-col>

          <!-- Form -->
          <v-col cols="12" md="4">
            <v-card class="py-6">
              <v-form ref="exchange-points-form" v-model="formValidity">
                <v-row justify="center">
                  <v-col cols="8">
                    <v-text-field
                      :value="totalPointsRest"
                      :label="$t('payments.totalPoints')"
                      append-icon="account_balance_wallet"
                      :disabled="true"
                      @change="$v.totalPointsRest.$touch()"
                    ></v-text-field>
                  </v-col>
                </v-row>
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
                      :value="costWithInterests"
                      :label="$t('payments.totalCost')"
                      append-icon="mdi-cash"
                      :disabled="true"
                      return-masked-value
                      mask="###.###.###-##"
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
                      item-text="last4"
                      item-value="idClientBankAccount"
                      @change="$v.selectedBankAccount.$touch()"
                      @blur="$v.selectedBankAccount.$touch()"
                      :error-messages="selectedBankAccountErrors"
                      :loading="loadingBankAccounts"
                      :disabled="loadingBankAccounts || loading"
                    ></v-select>
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
              <v-card-title class="headline">{{ $t("exchange-points-form.successfulWithdrawal") }}</v-card-title>
              <v-card-text>{{ $t("exchange-points-form.withdrawalToValidate") }}</v-card-text>
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
                <v-btn color="success" dark @click="exchangePoints">{{ $t("common.yes") }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import walletImage from "@/assets/Transaction/WithdrawsPoints.png";
import MakeItRain from "@/assets/MakeItRain.png";
import exchangePointsValidationMixin from "@/mixins/validation-forms/exchange-points.mixin.js";
import { states } from "@/constants/state";
import clientRoutes from "@/router/clientRoutes";
import PaymentInvoice from "@/components/Payments/PaymentInvoice";

export default {
  name: "exchange-points-form",
  mixins: [exchangePointsValidationMixin],
  components: {},
  data: function() {
    return {
      makeItRainImage: MakeItRain,
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
      totalPoints: 0,
    };
  },
  computed: {
    rawCost() {
      return (this.points * this.onePointToDollars).toFixed(2);
    },
    costWithInterests() {
      if (this.points) {
        let result = parseFloat(this.rawCost);
        this.interests.map(i => {
          result =
            result - (parseFloat(this.rawCost) * i.percentage + i.amount / 100);
        });
        return result.toFixed(2);
      } else return "0.00";
    },
    totalPointsRest() {
      if (this.points) return this.totalPoints - this.points;
      else return this.totalPoints;
    },
  },
  async mounted() {
    await this.loadBankAccounts();
    await this.loadRate();
    await this.loadInterests();
    await this.loadPoints();
  },
  methods: {
    async submitButton() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.areYouSureDialog = true;
      }
    },
    async exchangePoints() {
      this.areYouSureDialog = false;
      this.loading = true;
      this.$http
        .post("/payments/withdraw-points", {
          idClientBankAccount: this.selectedBankAccount,
          amount: (this.rawCost * 100).toFixed(2),
          amountToCharge: (this.costWithInterests * 100).toFixed(0),
        })
        .then(res => {
          this.transaction = res;
          this.paymentIsReady = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async loadPoints() {
      this.totalPoints = (
        await this.$http.get("/user/points/conversion")
      ).points;
    },
    async loadRate() {
      this.onePointToDollars = (
        await this.$http.get("/payments/one-point-to-dollars")
      ).onePointEqualsDollars;
      console.log(this.onePointToDollars);
    },
    async loadInterests() {
      this.interests = await this.$http.get(
        "/payments/interests/withdrawal/Withdrawal"
      );
      console.log(this.interests);
    },
    async loadBankAccounts() {
      const bankAccounts = await this.$http.get("/bank-account");

      this.bankAccounts = bankAccounts
        .filter(b => {
          const isActive = !!b?.clientBankAccount[0].stateBankAccount.find(
            sba => !sba.finalDate && sba.state.name === states.ACTIVE.name
          );
          return isActive;
        })
        .map(b => {
          return {
            idClientBankAccount: b.clientBankAccount[0].idClientBankAccount,
            last4: `XXXX-${b.accountNumber}`,
          };
        });

      this.loadingBankAccounts = false;
    },
  },
};
</script>
