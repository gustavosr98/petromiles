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
    <v-data-table
      class="font-weight-light"
      :loading="isLoading"
      :headers="headers"
      :items="fetchedData"
      :search="search"
    >
      <template #item.state="{value}">
        <v-chip class="overline" :color="getColor(value)" label dark>{{value}}</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { StateConstants } from "@/constants/constants.js";
export default {
  name: "datatable",
  props: {
    title: {
      type: String,
      required: true,
    },
    fetchedData: {
      type: Array,
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
      searchLabel: this.$tc("datatable.search"),
      isLoading: false,
      show_start_date: false,
      start_date: null,
      show_end_date: false,
      end_date: null,
      selected: [],
      filters: {
        search: "",
        start_date: null,
        end_date: null,
      },
    };
  },
  methods: {
    getColor(state) {
      let color = "";
      StateConstants.map(s => {
        if (s.state === state) {
          color = s.color;
        }
      });
      return color;
    },
  },
};
</script>