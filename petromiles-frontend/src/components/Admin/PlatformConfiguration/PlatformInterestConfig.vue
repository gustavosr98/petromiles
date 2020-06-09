<template>
  <div>
    <v-row align="center">
      <v-col cols="4" align="center">
        <v-overflow-btn
          :items="interestName"
          v-model="itemSelected"
          :label="$t('configuration.selectAnInterest')"
        ></v-overflow-btn>
      </v-col>
      <v-col cols="4" class="mt-0" align="center" v-if="item.amount">
        <v-text-field
          :value="item.amount"
          v-model="amount"
          :label="` ${$tc('common.amount',1)} ($)`"
        ></v-text-field>
      </v-col>
      <v-col cols="4" class="mt-0" align="center" v-if="item.percentage">
        <v-text-field
          :value="item.percentage"
          v-model="percentage"
          :label="`${$t('configuration.percentage')} (%)`"
          v-if="item.percentage"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="itemSelected">
      <v-col cols="3">
        <v-btn color="secondary" class="ma-2 white--text" @click="updateInterest">
          {{$t("configuration.update")}}
          <v-icon class="ml-3" x-small right dark>mdi-pencil</v-icon>
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
    platformInterests: { type: Array },
  },
  data() {
    return {
      itemSelected: null,
      percentage: null,
      amount: null,
      item: {},
      dialog: false,
    };
  },

  computed: {
    interestName: function() {
      return this.platformInterests.map(interest => interest.name);
    },
  },

  watch: {
    itemSelected: function() {
      this.item = this.platformInterests.find(
        interest => interest.name === this.itemSelected
      );
      this.percentage = this.item.percentage;
      this.amount = this.item.amount;
    },
  },
  methods: {
    updateInterest() {
      this.$http.put(
        `management/platform-interest/${this.item.idPlatformInterest}`,
        {
          name: this.item.name,
          amount: this.amount ? this.amount * 100 : null,
          percentage: this.percentage ? this.percentage / 100 : null,
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
