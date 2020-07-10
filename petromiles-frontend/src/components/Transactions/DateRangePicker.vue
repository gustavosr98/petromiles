<template>
  <div>
    <v-row class="mx-3" align="center">
      <v-col cols="12" sm="2" class="py-0 px-1">
        <v-menu
          v-model="menuInitialDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }" align="center" color="white">
            <v-text-field
              v-model="initialDate"
              :label="$t('date-picker.start')"
              append-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="initialDate" @input="filterData()"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="2" class="py-0 px-1" height="100">
        <v-menu
          v-model="menuFinalDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="finalDate"
              :label="$t('date-picker.end')"
              append-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="finalDate" @input="filterData()"></v-date-picker>
        </v-menu>
        <v-spacer></v-spacer>
      </v-col>
      <v-col cols="12" sm="2" class="py-0 px-1 ml-7" height="100">
        <v-btn
          color="primary lighten-4"
          depressed
          @click="resetDates"
        >{{ $t("transactions-filter.resetDates") }}</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    dataToFilter: { type: Array, required: true },
  },
  data() {
    return {
      menuInitialDate: false,
      menuFinalDate: false,
      finalDate: null,
      initialDate: null,
    };
  },
  methods: {
    resetDates() {
      this.menuInitialDate = false;
      this.menuFinalDate = false;
      this.finalDate = null;
      this.initialDate = null;

      this.$emit("filterData", this.dataToFilter);
    },
    filterData() {
      const filteredData = [];
      this.menuInitialDate = false;
      this.menuFinalDate = false;

      this.dataToFilter.forEach(data => {
        const [yearDate, monthDate, dayDate] = data.date.split("-");

        let finalValid, initialValid;

        if (this.initialDate) {
          const [
            yearInitialDate,
            monthInitialDate,
            dayInitialDate,
          ] = this.initialDate.split("-");

          initialValid =
            parseInt(yearInitialDate) <= parseInt(yearDate) &&
            parseInt(monthInitialDate) <= parseInt(monthDate) &&
            parseInt(dayInitialDate) <= parseInt(dayDate);
        }

        if (this.finalDate) {
          const [
            yearFinalalDate,
            monthFinalalDate,
            dayFinalalDate,
          ] = this.finalDate.split("-");

          finalValid =
            parseInt(yearFinalalDate) >= parseInt(yearDate) &&
            parseInt(monthFinalalDate) >= parseInt(monthDate) &&
            parseInt(dayFinalalDate) >= parseInt(dayDate);
        }

        if (this.initialDate && this.finalDate) {
          if (initialValid && finalValid) filteredData.push(data);
        } else if (this.initialDate && initialValid) {
          filteredData.push(data);
        } else if (this.finalDate && finalValid) {
          filteredData.push(data);
        }
      });
      this.$emit("filterData", filteredData);
    },
  },
};
</script>
<style scoped></style>
