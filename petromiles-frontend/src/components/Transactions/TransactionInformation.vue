<template>
  <v-card v-if="transaction">
    <v-subheader>
      <div class="title my-2 mx-2">
        <span class="font-weight-bold">
          {{
          $tc("transaction.transaction", 0)
          }}
        </span>
        #{{ transaction.id }}
      </div>
    </v-subheader>

    <v-divider></v-divider>

    <v-list-item class="pb-0">
      <v-col cols="12" md="5" class="pl-3">
        <span class="font-weight-medium">{{ $t("common.date") }}:</span>
        <span class="ml-2 font-weight-light">{{ transaction.date }}</span>
      </v-col>
    </v-list-item>

    <v-row class="mx-0 pt-0">
      <v-col cols="12" class="pt-0" justify="center">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title v-if="transaction.type !== transactionsType.THIRD_PARTY_CLIENT">
              <span class="font-weight-medium">{{ $tc("navbar.bankAccount", 0) }}:</span>
              <span class="ml-2 font-weight-light body-2">XXXX - {{ transaction.bankAccount }}</span>
            </v-list-item-title>
            <v-list-item-title v-if="transaction.thirdPartyClient">
              <span class="font-weight-medium">{{$t("transaction.company")}}:</span>
              <span class="ml-2 font-weight-light body-2 text-uppercase">
                {{
                transaction.thirdPartyClient
                }}
              </span>
            </v-list-item-title>
            <v-list-item-title v-if="transaction.type !== transactionsType.THIRD_PARTY_CLIENT">
              <span class="font-weight-medium">{{ $t("bank-account-properties.nickname") }}:</span>
              <span class="ml-2 font-weight-light body-2 text-uppercase">
                {{
                transaction.bankAccountNickname
                }}
              </span>
            </v-list-item-title>
            <v-list-item-title>
              <span class="font-weight-medium">{{$t("transaction.responsible")}}:</span>
              <span class="ml-2 font-weight-light body-2 text-uppercase">
                {{
                transaction.clientBankAccountEmail
                }}
              </span>
            </v-list-item-title>
            <v-list-item-title>
              <span class="font-weight-medium">{{ $t("common.type") }}:</span>
              <span class="ml-2 body-2 text-uppercase font-weight-light">{{type}}</span>
            </v-list-item-title>

            <v-list-item-title>
              <span class="font-weight-medium">{{ $t("common.state") }}:</span>
              <span class="ml-2 body-2 text-uppercase font-weight-light">
                {{
                $t(`state-name.${transaction.state}`)
                }}
              </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>

    <v-simple-table>
      <tbody>
        <!-- Just for deposit and withdrawal transactions -->
        <tr class="text-center font-weight-bold" v-if="paymentTransaction">
          <td>{{ $t("payments.points") }}</td>
          <td>
            <v-chip
              class="px-5 py-0"
              color="secondary"
              text-color="white"
              label
              @click.stop="dialog = true"
            >{{ $t("common.see") }}</v-chip>
          </td>
        </tr>
        <!-- For all type of transactions -->

        <tr class="text-center" v-if="transaction.type !== transactionsType.THIRD_PARTY_CLIENT">
          <td class="font-weight-bold">{{ $tc("common.amount", 0) }}</td>
          <td>{{ Math.round(transaction.amount * 100) / 100 !== 0 ? (transaction.amount).toFixed(2) : transaction.amount }} $</td>
        </tr>

        <tr class="text-center" v-if="transaction.type !== transactionsType.THIRD_PARTY_CLIENT">
          <td class="font-weight-bold">{{ $t("invoice.taxes") }}</td>
          <td>{{ Math.round(transaction.amount * 100) / 100 !== 0 ? (transaction.interest).toFixed(2) : transaction.interest }} $</td>
        </tr>

        <tr class="text-center total-item">
          <td class="font-weight-bold">{{ $t("common.total") }}</td>
          <td
            v-if="transaction.type !== transactionsType.THIRD_PARTY_CLIENT"
          >{{ Math.round(transaction.amount * 100) / 100 !== 0 ? (transaction.total).toFixed(2) : transaction.total }} $</td>
          <td
            v-else
          >{{ Math.round(transaction.amount * 100) / 100 !== 0 ? (transaction.amount).toFixed(2) : transaction.amount }} $</td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- Modal for points conversion -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">
          {{
          $t("common.yourPoints")
          }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2 px-8">
          <v-alert dense text color="primary" v-if="paymentTransaction">
            1 USD =
            {{ transaction.pointsConversion }} {{ $t("payments.points") }}
            <br />

            <v-row>
              <v-col>
                <div class="d-flex justify-end align-center">
                  <p class="mb-1 mr-4 font-weight-bold">{{ $t("payments.points") }}</p>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <p class="mb-1">{{ typeLabel }}</p>
                  <p class="mr-4 mb-1">{{ transaction.pointsEquivalent }}</p>
                </div>
                <div
                  class="d-flex justify-space-between align-center"
                  v-if="(transaction.type == transactionsType.DEPOSIT || transaction.type === transactionsType.THIRD_PARTY_CLIENT) && this.transaction.extra && this.transaction.extra > 0"
                >
                  <p
                    class="mb-1"
                    v-if="this.extraPointsType == suscriptionsType.PREMIUM"
                  >{{ $t("transaction.subscriptionExtraPremium") }}</p>
                  <p
                    class="mb-1"
                    v-if="this.extraPointsType == suscriptionsType.GOLD"
                  >{{ $t("transaction.subscriptionExtraGold") }}</p>
                  <p class="mr-4 mb-1">{{ transaction.extra}}</p>
                </div>
                <v-divider></v-divider>
                <div class="d-flex justify-space-between align-center mt-2">
                  <p class="mb-1 font-weight-bold">{{ $t("common.total") }}</p>
                  <p
                    class="mr-4 mb-1 font-weight-bold"
                  >{{ transaction.extra + transaction.pointsEquivalent }}</p>
                </div>
              </v-col>
            </v-row>
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import Transactions from "@/constants/transaction.js";
import Suscriptions from "@/constants/suscriptions.js";
export default {
  props: {
    idTransaction: { type: Number, required: true },
  },
  data() {
    return {
      transaction: null,
      dialog: false,
      transactionsType: Transactions,
      suscriptionsType: Suscriptions,
      extraPointsType: "",
    };
  },
  async mounted() {
    this.transaction = await this.$http.get(
      `/transaction/${this.idTransaction}`
    );
    if (this.transaction.extra && this.transaction.extra > 0) {
      this.extraPointsType = await this.$http.get(
        `/transaction/extra-points-type/${this.idTransaction}`
      );
    }
  },
  computed: {
    type: function() {
      if (this.transaction.type) {
        return this.$tc(`transaction-type.${this.transaction.type}`);
      }
      return "";
    },

    typeLabel: function() {
      let label;
      if (
        this.transaction.type === Transactions.DEPOSIT ||
        this.transaction.type === Transactions.THIRD_PARTY_CLIENT
      ) {
        label = this.$tc("transaction.yourPurchase");
      } else if (this.transaction.type === Transactions.WITHDRAWAL) {
        label = this.$tc("transaction.yourWithdrawal");
      } else {
        label = "";
      }
      return label;
    },

    paymentTransaction: function() {
      if (
        this.transaction.type === Transactions.BANK_ACCOUNT_VERIFICATION ||
        this.transaction.type === Transactions.SUBSCRIPTION_PAYMENT
      )
        return false;
      return true;
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 20px !important;
}
.title span {
  font-weight: bold !important;
  font-size: 24px !important;
}
.total-item {
  background-color: #1b3d6e;
  color: white !important;
}
.total-item:hover {
  background-color: #1b3d6e !important;
}
</style>
