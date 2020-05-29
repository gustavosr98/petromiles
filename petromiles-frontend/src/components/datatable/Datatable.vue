<template>
  <v-card class="ma-2">
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="$tc('datatable.search')"
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
        <v-chip outlined class="overline" :color="getColor(value)" label dark>{{
          value
        }}</v-chip>
      </template>
      <template #item.details="{item}">
        <v-btn color="secondary" x-small :to="createLink(item.id)">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <template #item.cancel="{item}">
        <v-icon @click="confirmDeleteAction(item.idBankAccount)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <!-- Dialog to confirm delete action -->
    <v-row justify="center">
      <v-dialog v-model="eliminateDialog" persistent max-width="50%">
        <v-card>
          <v-card-title class="headline">{{
            $t("common.areYouSure")
          }}</v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="error" dark @click="eliminateDialog = false">{{
              $t("common.cancel")
            }}</v-btn>
            <v-btn color="success" dark @click="eliminateItem">{{
              $t("common.yes")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-card>
</template>

<script>
import { getColor } from "@/mixins/getColor.js";
export default {
  name: "datatable",
  mixins: [getColor],
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
      isLoading: false,
      eliminateDialog: false,
      elementToDelete: null,
    };
  },
  methods: {
    createLink(id) {
      return `${this.linkTo}/${id}`;
    },
    confirmDeleteAction(id) {
      this.eliminateDialog = true;
      this.elementToDelete = id;
    },
    eliminateItem() {
      this.eliminateDialog = false;
      this.$emit("deleteItem", this.elementToDelete);
    },
  },
};
</script>
