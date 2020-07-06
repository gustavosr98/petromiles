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
      <template #item.state="{item}">
        <v-tooltip bottom v-if="isAdmin">
          <template v-slot:activator="{ on, attrs }">
            <v-chip outlined class="overline" :color="getColor(item.state.name)" label dark @click="changeUserState(item)" v-bind="attrs" v-on="on">
              {{
              item.state.translated
              }}
            </v-chip>
          </template>
          <span>Click to Change State</span>
        </v-tooltip>
        <v-chip v-else outlined class="overline" :color="getColor(item.state.name)" label dark>
          {{
          item.state.translated
          }}
        </v-chip>
      </template>
      <template #item.bankAccountState="{item}">
        <v-tooltip bottom v-if="isAdmin">
          <template v-slot:activator="{ on, attrs }">
            <v-chip outlined class="overline" :color="getColor(item.bankAccountState.name)" label dark @click="changeBankAccountState(item)" v-bind="attrs" v-on="on">
              {{
              item.bankAccountState.translated
              }}
            </v-chip>
          </template>
          <span>Click to Change State</span>
        </v-tooltip>
        <v-chip v-else outlined class="overline" :color="getColor(item.bankAccountState.name)" label dark>
          {{
          item.bankAccountState.translated
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
          :isAdmin="isAdmin"
          :clientID="clientID"
        />
      </v-dialog>
    </v-row>

    <snackbar @close="closeSnackbar" :show="showSnackbar" :text="text"></snackbar>
  </v-card>
</template>

<script>
import { createNamespacedHelpers, mapState } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");
import { getColor } from "@/mixins/tables/getColor.js";
import TransactionInformation from "@/components/Transactions/TransactionInformation";
import BankAccountDetails from "@/components/BankAccounts/BankAccountList/BankAccountDetails";
import Snackbar from "@/components/General/Snackbar/Snackbar.vue";
import Tables from "@/constants/table";
import { states } from "@/constants/state";
import auth from "@/constants/authConstants";
export default {
  name: "datatable",
  mixins: [getColor],
  components: {
    "transaction-information": TransactionInformation,
    "bank-account-details": BankAccountDetails,
    "snackbar": Snackbar
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
    userType: {
      default: auth.CLIENT
    },
    isAdmin: {
      default: false
    },
    clientID: {
      default: 0
    }
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
      showSnackbar: false,
      text: "",
    };
  },
  computed: {
    ...mapState("auth", ["user"]),  
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
    
    async changeUserState(item){
      if(this.user.email !== item.email){
        this.$emit('updateUserState', item);        
      }   
      else {
        this.text = "You cannot block yourself.";
        this.showSnackbar = true;
      }   
    },
    changeBankAccountState(item){      
      this.$emit('updateBankAccountState', item);
    },
    closeSnackbar(){
      this.showSnackbar = false;
    },
  },  
  watch: {
    details: function() {
      if (!this.details) this.elementDetails = "";
    },
  },
};
</script>