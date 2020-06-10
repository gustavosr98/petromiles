<template>
  <div>
    <v-row align="center">
      <!-- Menu for payment providers -->
      <v-col cols="4" align="center">
        <v-overflow-btn
          :items="providerName"
          v-model="providerSelected"
          :label="$t('configuration.selectAPaymentProvider')"
        ></v-overflow-btn>
      </v-col>

      <!-- Menu for interests type -->
      <v-col cols="4" align="center" v-if="interestsType">
        <v-overflow-btn
          :items="interestsType"
          v-model="transactionType"
          :label="$t('configuration.selectAType')"
        ></v-overflow-btn>
      </v-col>
      <!-- Field to change the amount -->
      <v-col cols="4" class="mt-0" align="center" v-if="interest">
        <v-text-field :value="amount" v-model="amount" :label="`${$tc('common.amount',0)} ($)`"></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-row v-if="providerSelected">
      <v-col cols="3">
        <v-btn color="secondary" class="ma-2 white--text" @click="updateInterest">
          {{$t("configuration.update")}}
          <v-icon right dark>mdi-pencil</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <configuration-modal @closeModal="closeModal" :dialog="dialog" />
  </div>
</template>
<script>
import ConfigurationModal from "@/components/General/Modals/ConfigurationModal/ConfigurationModal.vue";

export default {
  components: {
    "configuration-modal": ConfigurationModal,
  },
  props: {
    thirdPartyInterest: { type: Array },
  },
  data() {
    return {
      providerSelected: null,
      amount: null,
      interestsType: [],
      paymentTransaction: [],
      transactionType: null,
      interest: {},
      dialog: false,
    };
  },

  computed: {
    providerName: function() {
      return this.thirdPartyInterest.map(interest => interest.paymentProvider);
    },
  },

  watch: {
    providerSelected: function() {
      this.thirdPartyInterest.forEach(interest => {
        if (interest.paymentProvider == this.providerSelected)
          this.interestsType.push(interest.transactionType);
      });
    },
    transactionType: function() {
      this.thirdPartyInterest.forEach(interest => {
        if (
          interest.transactionType == this.transactionType &&
          interest.paymentProvider == this.providerSelected
        ) {
          this.interest = interest;
          this.amount = interest.amountDollarCents;
        }
      });
    },
  },
  methods: {
    updateInterest() {
      this.$http.put(
        `management/third-party-interest/${this.interest.idThirdPartyInterest}`,
        {
          name: this.interest.name,
          amountDollarCents: this.amount * 100,
          paymentProvider: this.interest.paymentProvider,
          transactionType: this.interest.transactionType,
        }
      );
      this.dialog = true;
    },
    closeModal() {
      this.dialog = false;
    },
  },
};
</script>
