<template>
  <div>
    <v-row>
      <v-col cols="12" align="center">
        <v-select
          v-model="selectedInterest"
          item-text="name"
          item-value="id"
          :items="interests"
          label="Select an interest"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="selectedInterest">
      <v-col cols="12" md="6" align="center" class="mt-3" width="100%">
        <v-expand-transition>
          <v-alert color="primary" class="white--text d-flex align-center" height="90%">
            <h3
              class="subtitle-1 font-weight-bold font-italic text-capitalize"
            >{{ interestData.name }}</h3>
            <div
              class="font-weight-light text-justify"
            >{{ $t(`interests.${interestData.description}`) }}</div>
          </v-alert>
        </v-expand-transition>
      </v-col>

      <v-col cols="12" md="6" align="center">
        <v-row align="center">
          <v-col cols="12" class="mt-0 pb-0" align="center" v-if="interestData.amount !==null">
            <v-text-field
              :value="amount"
              type="number"
              v-model="amount"
              :label="$t('subscription.cost') "
              @change="$v.interestData.amount.$touch()"
              @blur="$v.interestData.amount.$touch()"
              :error-messages="amountErrors"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="mt-0 py-0" align="center" v-if="interestData.percentage !==null">
            <v-text-field
              :value="interestData.percentage"
              v-model="interestData.percentage"
              :label="$tc('common.amount', 0) "
              @change="$v.interestData.percentage.$touch()"
              @blur="$v.interestData.percentage.$touch()"
              :error-messages="percentageErrors"
              type="number"
            ></v-text-field>
          </v-col>
          <update-btn @update="update" :loading="loading" />
        </v-row>
      </v-col>
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
    subscriptions: { type: Array, required: true },
  },
  data() {
    return {
      selectedInterest: null,
      interests: [],
      amount: 0,
      dialog: false,
      message: "",
      loading: false,
    };
  },
  mounted() {
    this.interests = this.getInterest();
    this.selectedInterest = this.interests[0].id;
  },
  computed: {
    modalMessage: function() {
      return this.message;
    },
  },
  watch: {
    selectedInterest: function() {
      this.interestData = this.interests.find(
        interest => interest.id == this.selectedInterest
      );
      this.amount = this.interestData.amount;
    },
    amount: function() {
      this.interestData.amount = this.amount;
    },
  },
  methods: {
    getInterest: function() {
      const newData = [];

      this.subscriptions.forEach(d => {
        if (d.cost || d.upgradedAmount) {
          newData.push({
            id: d.idSuscription,
            name: d.name,
            amount: d.cost === 0 ? null : d.cost,
            percentage: d.upgradedAmount,
            description: d.description,
            points: null,
          });
        }
      });
      return newData;
    },
    async update() {
      if (!this.$v.$invalid) {
        this.loading = true;

        await this.$http
          .put(
            `management/subscription/${this.interestData.id}`,
            this.calculateInterests()
          )
          .then(() => {
            this.message = this.$t("configuration.changeMadeSuccessfully");
            this.dialog = true;
          })
          .finally(() => (this.loading = false));
      }
    },
    calculateInterests() {
      let { amount, percentage } = this.interestData;

      return {
        cost: amount ? Math.round(amount * 10000) / 100 : 0,
        upgradedAmount: percentage
          ? Math.round(percentage * 10000) / 100
          : null,
      };
    },
    closeModal() {
      this.dialog = false;
    },
  },
};
</script>
