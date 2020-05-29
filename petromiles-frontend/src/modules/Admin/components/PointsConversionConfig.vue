<template>
  <div>
    <v-row align="center">
      <v-col cols="4" class="mt-0" align="center">
        <v-text-field
          :value="pointsConversion.onePointEqualsDollars"
          v-model="amount"
          :label="`1 USD ${$t('configuration.equalsTo')}`"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col cols="4">
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
import ConfigurationModal from "@/modules/Admin/components/ConfigurationModal.vue";

export default {
  components: {
    "configuration-modal": ConfigurationModal,
  },
  props: {
    pointsConversion: { type: Object },
  },
  data() {
    return {
      amount: 1 / this.pointsConversion.onePointEqualsDollars,
      dialog: false,
    };
  },
  methods: {
    updateInterest() {
      this.$http.put(
        `management/points-conversion/${this.pointsConversion.idPointsConversion}`,
        { onePointEqualsDollars: 1 / this.amount }
      );
      this.dialog = true;
    },
    closeModal() {
      this.dialog = false;
    },
  },
};
</script>
