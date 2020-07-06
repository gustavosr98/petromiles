<template>
  <div>
    <v-row align="center">
      <v-col cols="12" md="5" class="mt-0" align="center">
        <v-select
          v-model="selectedFrequency"
          item-text="type"
          item-value="idTask"
          :items="frequencies"
          :label="$t(`configuration.frequencies`)"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4" class="mt-0" align="center">
        <v-select v-model="selectedTime" :items="times" label="frecuency"></v-select>
      </v-col>
      <update-btn @update="update" :loading="loading" />
      <v-spacer></v-spacer>
    </v-row>
    <configuration-modal
      @closeModal="closeModal"
      :dialog="dialog"
      :message="$t(`configuration.changeMadeSuccessfully`)"
    />
  </div>
</template>
<script>
import ConfigurationModal from "@/components/General/Modals/ConfigurationModal/ConfigurationModal.vue";
import { cronJobs, cronFrequencies } from "@/constants/cron-job";
import UpdateBtn from "@/components/Admin/PlatformConfiguration/UpdateBtn";

export default {
  components: {
    "configuration-modal": ConfigurationModal,
    "update-btn": UpdateBtn,
  },
  props: {
    frequencies: { type: Array, required: true },
  },
  data() {
    return {
      selectedTime: 0,
      selectedFrequency: 0,
      times: cronFrequencies.frequencies,
      dialog: false,
      loading: false,
    };
  },
  mounted() {
    this.frequencies.forEach(
      frequency =>
        (frequency.type = this.$t(
          `configuration.${cronJobs[frequency.name].name}`
        ))
    );
    this.selectedFrequency = this.frequencies[0].idTask;
  },
  watch: {
    selectedFrequency: function() {
      const time = this.findFrequency().frequency;
      this.selectedTime = time + " min";
    },
  },
  methods: {
    async update() {
      this.loading = true;

      await this.$http
        .put("cron", {
          frequency: parseInt(this.selectedTime.split(" min")[0]) * 60000,
          name: this.findFrequency().name,
        })
        .then(() => {
          this.updateFrecuencyList();
          this.dialog = true;
        })
        .finally(() => (this.loading = false));
    },
    closeModal() {
      this.dialog = false;
    },
    findFrequency() {
      return this.frequencies.find(f => f.idTask === this.selectedFrequency);
    },
    updateFrecuencyList() {
      this.frequencies.map(f => {
        if (f.idTask === this.selectedFrequency)
          f.frequency = this.selectedTime.split(" min")[0];

        return f;
      });
    },
  },
};
</script>