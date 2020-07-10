<template>
  <div>
    <v-row align="center">
      <!-- Menu for payment providers -->
      <v-col cols="5" align="center">
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
      <v-col cols="3" class="mt-0" align="center" v-if="interest">
        <v-text-field
          :value="interestData.amount"
          v-model="interestData.amount"
          type="number"
          :label="`${$tc('common.amount', 0)} ($)`"
          @change="$v.interestData.amount.$touch()"
          @blur="$v.interestData.amount.$touch()"
          :error-messages="amountErrors"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-row v-if="transactionType">
      <update-btn @update="update" :loading="loading" />
    </v-row>

    <configuration-modal @closeModal="closeModal" :dialog="dialog" :message="modalMessage" />
  </div>
</template>
<script>
import ConfigurationModal from "@/components/General/Modals/ConfigurationModal/ConfigurationModal.vue";
import PlatformConfigMixin from "@/mixins/validation-forms/platform-config.mixin";
import UpdateBtn from "@/components/Admin/PlatformConfiguration/UpdateBtn";

export default {
  mixins: [PlatformConfigMixin],
  components: {
    "configuration-modal": ConfigurationModal,
    "update-btn": UpdateBtn,
  },
  props: {
    thirdPartyInterest: { type: Array },
  },
  data() {
    return {
      providerSelected: null,
      interestsType: [],
      paymentTransaction: [],
      transactionType: null,
      interest: {},
      dialog: false,
      message: "",
      loading: false,
    };
  },

  computed: {
    providerName: function() {
      return this.thirdPartyInterest.map(interest => interest.paymentProvider);
    },
    modalMessage: function() {
      return this.message;
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
          this.interestData.amount = interest.amountDollarCents;
        }
      });
    },
  },
  methods: {
    async update() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.loading = true;

        const amount = this.interestData.amount * 100;
        await this.$http
          .put(
            `management/third-party-interest/${this.interest.idThirdPartyInterest}`,
            {
              name: this.interest.name,
              amountDollarCents: amount,
              paymentProvider: this.interest.paymentProvider,
              transactionType: this.interest.transactionType,
            }
          )
          .then(res => {
            this.interest.idThirdPartyInterest = res.idThirdPartyInterest;
            this.updateInterestList(amount);
            this.message = this.$t("configuration.changeMadeSuccessfully");
            this.dialog = true;
          })
          .finally(() => (this.loading = false));
      }
    },
    closeModal() {
      this.dialog = false;
    },
    updateInterestList() {
      this.thirdPartyInterest.map(i => {
        if (
          i.paymentProvider === this.providerSelected &&
          i.transactionType === this.transactionType
        )
          i.amountDollarCents = this.interestData.amount;
      });
    },
  },
};
</script>
