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
        <v-chip outlined class="overline" :color="getColor(value)" label dark>{{value}}</v-chip>
      </template>
      <template #item.details="{item}">
        <v-btn color="secondary" x-small :to="createLink(item.id)">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { States } from "@/constants/state.js";
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
    linkTo: { type: String },
  },
  data() {
    return {
      search: "",
      searchLabel: this.$tc("datatable.search"),
      isLoading: false,
    };
  },
  methods: {
    createLink(id) {
      return `${this.linkTo}/${id}`;
    },
    getColor(state) {
      let color = "";
      States.map(s => {
        if (s.state === state) {
          color = s.color;
        }
      });
      return color;
    },
  },
};
</script>