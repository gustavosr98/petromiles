<template>
  <div>
    <v-row>
      <v-col cols="12" align="center">
        <v-select
          v-model="selectedInterest"
          item-text="type"
          item-value="type"
          :items="interests"
          :label="$t(`configuration.selectAnInterest`)"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="selectedInterest">
      <v-col cols="12" md="6" align="center" class="mt-3" width="100%">
        <v-expand-transition>
          <v-alert color="primary" class="white--text d-flex align-center" height="90%">
            <h3
              class="subtitle-1 font-weight-bold font-italic text-capitalize"
            >{{ interestData.type }}</h3>
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
              :label="labels[0]"
              @change="$v.interestData.amount.$touch()"
              @blur="$v.interestData.amount.$touch()"
              :error-messages="amountErrors"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="mt-0 pb-0" align="center" v-if="interestData.points !==null">
            <v-text-field
              :value="interestData.points"
              type="number"
              v-model="interestData.points"
              :label="labels[0]"
              @change="$v.interestData.points.$touch()"
              @blur="$v.interestData.points.$touch()"
              :error-messages="pointsErrors"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="mt-0 py-0" align="center" v-if="interestData.percentage !==null">
            <v-text-field
              :value="interestData.percentage"
              v-model="interestData.percentage"
              :label="labels[1]"
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
    platformInterest: { type: Array, required: true },
    labels: { type: Array },
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
    this.selectedInterest = this.interests[0].type;
  },
  computed: {
    modalMessage: function() {
      return this.message;
    },
  },
  watch: {
    selectedInterest: function() {
      this.interestData = this.interests.find(
        interest => interest.type == this.selectedInterest
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
      this.platformInterest.forEach(d => {
        newData.push({
          id: d.idPlatformInterest,
          name: d.name,
          type: this.$t(`interest.${d.name.toLowerCase()}Config`),
          amount: d.amount,
          percentage: d.percentage,
          points: d.points,
          description: d.description,
          suscription: d.suscription,
        });
      });
      return newData;
    },
    async update() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        await this.$http
          .put(
            `management/platform-interest/${this.interestData.id}`,
            this.calculateInterests()
          )
          .then(res => {
            this.interestData.id = res.idPlatformInterest;
            this.updateInterestList();
            this.message = this.$t("configuration.changeMadeSuccessfully");
            this.dialog = true;
          })
          .finally(() => (this.loading = false));
      }
    },
    calculateInterests() {
      let { id, amount, percentage, type, ...item } = this.interestData;

      return {
        amount: amount ? Math.round(amount * 10000) / 100 : null,
        percentage: percentage ? Math.round(percentage * 100) / 10000 : null,
        ...item,
      };
    },
    closeModal() {
      this.dialog = false;
    },
    updateInterestList() {
      this.interests.map(i => {
        if (i.name == this.interestData.name) {
          i.percentage = this.interestData.percentage;
          i.amount = this.interestData.amount;
          i.points = this.interestData.points;
        }
        return i;
      });
    },
  },
};
</script>
