<template>
  <v-card class="mx-auto my-9 pb-6" max-width="550" tile>
    <v-subheader>
      <div class="title">
        <span class="font-weight-bold">{{ $tc("transaction.transaction")}}</span>
        #{{ transaction.id }}
      </div>
    </v-subheader>

    <v-divider></v-divider>

    <v-list-item>
      <v-col cols="12" md="5" class="pl-0">
        <span class="font-weight-medium">{{ $t("common.date") }}:</span>
        <span class="ml-2 font-weight-light">{{ transaction.date }}</span>
      </v-col>
    </v-list-item>

    <v-row>
      <v-col cols="12" justify="center" class="ml-1">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>
              <span class="font-weight-medium">{{ $tc("navbar.bankAccount", 0) }}:</span>
              <span class="ml-2 font-weight-light caption">XXXX - {{ transaction.bankAccount }}</span>
            </v-list-item-title>

            <v-list-item-title>
              <span class="font-weight-medium">{{ $t("common.type") }}:</span>
              <span class="ml-2 caption text-uppercase font-weight-light">{{ type }}</span>
            </v-list-item-title>

            <v-list-item-title>
              <span class="font-weight-medium">{{ $t("common.state") }}:</span>
              <span
                class="ml-2 caption text-uppercase font-weight-light"
              >{{ $t(`state-name.${transaction.state}`) }}</span>
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
            >{{ transaction.equivalent / 100 }}</v-chip>
          </td>
        </tr>
        <!-- For all type of transactions -->

        <tr class="text-center">
          <td class="font-weight-bold">{{ $tc("common.amount", 0) }}</td>
          <td>{{ amount }} $</td>
        </tr>

        <tr class="text-center">
          <td class="font-weight-bold">{{ $t("invoice.taxes") }}</td>
          <td>{{ transaction.interest / 100 }} $</td>
        </tr>

        <tr class="text-center total-item">
          <td class="font-weight-bold">Total</td>
          <td>{{ total }} $</td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- Modal for points conversion -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">
          {{
          $tc("transaction.pointsConversion")
          }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2" align="center">
          <v-alert dense text color="primary" v-if="paymentTransaction">
            1 USD =
            {{ transaction.conversion }} {{ $t("payments.points") }}
            <br />
            <strong>
              {{ transaction.amount / 100 }} USD =
              {{ transaction.equivalent / 100 }}
              {{ $t("payments.points") }}
              <br />
            </strong>
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import Transactions from "@/constants/transaction.js";
export default {
  props: {
    idTransaction: { type: String, required: true },
  },
  data() {
    return {
      transaction: {},
      dialog: false,
    };
  },
  async mounted() {
    this.transaction = await this.$http.get(
      `/transaction/${parseInt(this.idTransaction)}`
    );
  },
  computed: {
    amount: function() {
      if (this.transaction.type == Transactions.BANK_ACCOUNT_VERIFICATION)
        return this.transaction.amount;
      return this.transaction.amount / 100;
    },
    total: function() {
      if (this.transaction.type == Transactions.BANK_ACCOUNT_VERIFICATION)
        return this.transaction.amount;
      return (
        this.transaction.amount / 100 +
        this.transaction.interest / 100
      ).toFixed(3);
    },
    type: function() {
      if (this.transaction.type) {
        return this.$tc(`transaction-type.${this.transaction.type}`);
      }
      return "";
    },
    paymentTransaction: function() {
      if (this.transaction.type !== Transactions.BANK_ACCOUNT_VERIFICATION)
        return true;
      return false;
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
