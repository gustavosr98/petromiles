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
          <v-col cols="12" md="4">
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
                      @change="$v.points.$touch()"
                      @blur="$v.points.$touch()"
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
        @pdfIsCreated="pdfIsCreated"
        :transaction="transaction"
        v-if="paymentIsReady"
      />
    </v-row>
  </div>
</template>

<script>
import piggyImage from "@/assets/Transaction/BuyPoints.png";
import buyPointsValidationMixin from "@/modules/Payments/Points/mixins/buyPointsValidation.mixin.js";
import { states } from "@/constants/state";
import clientRoutes from "@/router/clientRoutes";
import PaymentInvoice from "@/modules/Payments/Points/components/PaymentInvoice";

export default {
  name: "buy-points-form",
  mixins: [buyPointsValidationMixin],
  components: {
    "payments-invoice": PaymentInvoice,
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
            result + parseFloat(this.rawCost) * i.percentage + i.amount / 100;
        });
        return result.toFixed(2);
      } else return "0.00";
    },
  },
  async mounted() {
    await this.loadBankAccounts();
    await this.loadRate();
    await this.loadInterests();
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
          amount: (this.rawCost * 100).toFixed(2),
          amountToCharge: this.costWithInterests * 100,
        })
        .then(res => {
          this.transaction = res;
          this.paymentIsReady = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async loadRate() {
      this.onePointToDollars = await this.$http.get(
        "/payments/one-point-to-dollars"
      );
    },
    async loadInterests() {
      this.interests = await this.$http.get("/payments/interests/deposit");
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
    pdfIsCreated() {
      this.dialog = true;
      this.loading = false;
    },
  },
};
</script>
