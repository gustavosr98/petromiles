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
        <v-chip outlined class="overline" :color="getColor(value.name)" label dark @click="changeState(value)">
          {{
          value.translated
          }}
        </v-chip>
      </template>
      <template #item.details="{item}">
        <v-btn color="secondary" @click="seeDetails(item.id)" x-small>
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <template #item.cancel="{item}">
        <v-icon @click="confirmDeleteAction(item.idBankAccount)">mdi-delete</v-icon>
      </template>
      <template #item.userDetails="{item}">
        <v-btn color="secondary" @click="seeUserDetails(item)" x-small>
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-row justify="center">
      <v-dialog v-model="details" max-width="600">
        <transaction-information
          :idTransaction="elementId"
          v-if="elementDetails === this.table.TRANSACTIONS"
        />
        <bank-account-details
          :idBankAccount="elementId"
          v-if="elementDetails === this.table.BANK_ACCOUNTS"
          @deleteItem="deleteItem"
        />
      </v-dialog>
    </v-row>
  </v-card>
</template>

<script>
import { getColor } from "@/mixins/tables/getColor.js";
import TransactionInformation from "@/components/Transactions/TransactionInformation";
import BankAccountDetails from "@/components/BankAccounts/BankAccountList/BankAccountDetails";
import Tables from "@/constants/table";

export default {
  name: "datatable",
  mixins: [getColor],
  components: {
    "transaction-information": TransactionInformation,
    "bank-account-details": BankAccountDetails,
  },
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
    tableName: { type: String },
  },
  data() {
    return {
      search: "",
      isLoading: false,
      elementToDelete: null,
      details: false,
      elementDetails: "",
      elementId: null,
      table: Tables,
      bankAccount: null,
    };
  },
  methods: {
    seeDetails(id) {
      this.elementId = id;
      this.elementDetails = this.tableName;
      this.details = true;
    },
    createLink(id) {
      return `${this.linkTo}/${id}`;
    },
    confirmDeleteAction(id) {
      this.eliminateDialog = true;
      this.elementToDelete = id;
    },
    deleteItem(id) {
      this.details = false;
      this.$emit("deleteItem", id);
    },
    seeUserDetails(user){      
      this.$router.push({name: "AdminUsersDetail", params: {user: user}});
    },
    
    //ESTO DE ABAJO FUE ESCRITO POR RAFAEL - NO TOCAR YA QUE SE VA A USAR
    changeState(item){
      console.log("I wanna change its state: ", item);
      /*if(item.name === "active"){
        item.name = "blocked";
        item.translated = "blocked";
      }
      else{
        item.name = "active";
        item.translated = "active";
      }*/
    }
  },
  watch: {
    details: function() {
      if (!this.details) this.elementDetails = "";
    },
  },
};
</script>
