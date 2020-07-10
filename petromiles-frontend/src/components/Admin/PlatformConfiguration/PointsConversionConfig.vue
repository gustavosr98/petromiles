<template>
  <div>
    <v-row align="center">
      <v-col cols="12" md="4" class="mt-0" align="center">
        <v-text-field
          :value="pointsConversion.onePointEqualsDollars"
          v-model="interestData.points"
          type="number"
          :label="`1 USD ${$t('configuration.equalsTo')}`"
          @change="$v.interestData.points.$touch()"
          @blur="$v.interestData.points.$touch()"
          :error-messages="pointsErrors"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
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
    pointsConversion: { type: Object },
  },
  data() {
    return {
      dialog: false,
      message: "",
      loading: false,
    };
  },
  mounted() {
    this.interestData.points = Math.round(
      1 / this.pointsConversion.onePointEqualsDollars
    );
  },
  methods: {
    async update() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        const onePointEqualsDollars = 1 / this.interestData.points;
        await this.$http
          .put(
            `management/points-conversion/${this.pointsConversion.idPointsConversion}`,
            { onePointEqualsDollars }
          )
          .then(res => {
            this.pointsConversion.idPointsConversion = res.idPointsConversion;
            this.message = this.$t("configuration.changeMadeSuccessfully");
            this.dialog = true;
            this.$emit("update", onePointEqualsDollars);
          })
          .finally(() => (this.loading = false));
      }
    },
    closeModal() {
      this.dialog = false;
    },
  },
  computed: {
    modalMessage: function() {
      return this.message;
    },
  },
};
</script>
