<template>
  <v-card class="ma-2">
    <v-card-title>
      {{title}}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="searchLabel"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :loading="isLoading" :headers="headers" :items="fetchedData" :search="search"></v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "datatable",
  props: {
    title: {
      type: String,
      required: true,
    },
    dataUrl: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      fetchedData: [],
      searchLabel: this.$tc("datatable.search"),
      isLoading: false,
    };
  },
  async mounted() {
    this.isLoading = true;
    this.fetchedData = await this.$http.get(this.dataUrl);
    this.isLoading = false;
  },
};
</script>