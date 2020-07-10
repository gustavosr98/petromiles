<template>
  <div>
    <v-row align="center" justify="center" class="mx-auto">
      <v-col cols="12" md="10">
        <datatable
          :title="title"
          :headers="headers"
          :fetchedData="mungedData"
          @deleteItem="deleteItem"
          @updateBankAccountState="updateBankAccountState"
          tableName="bank-accounts"
          :isAdmin="isAdmin"
          :clientID="clientID"
        ></datatable>
      </v-col>
    </v-row>
    <loading-screen :visible="showLoadingScreen"></loading-screen>
  </div>
</template>

<script>
import Datatable from "@/components/General/Datatable/Datatable";
import { states } from "@/constants/state";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";

export default {
  name: "bank-accounts-table",
  props: {
    isAdmin: {
      default: false,
    },
    bankAccounts: {
      default: null,
    },
    clientID: {
      default: 0,
    },
  },
  components: {
    Datatable,
    "loading-screen": LoadingScreen,
  },
  data() {
    return {
      fetchedData: [],
      showLoadingScreen: true,
    };
  },
  async mounted() {
    if (!this.bankAccounts) {
      this.fetchedData = await this.$http.get("/bank-account").finally(() => {
        this.showLoadingScreen = false;
      });
      this.$store.commit("bankAccount/SET_BANK_ACCOUNTS", this.fetchedData);
    } else {
      this.fetchedData = this.bankAccounts;
    }    
    this.showLoadingScreen = false;
  },
  computed: {
    title() {
      return this.$tc("navbar.bankAccount");
    },
    headers() {
      return [
        {
          text: `${this.$t("bank-account-properties.nickname")}`,
          align: "center",
          value: "nickname",
        },
        {
          text: `${this.$t("bank-account-properties.accountNumber")}`,
          align: "center",
          value: "number",
        },
        {
          text: this.$t("bank-account-properties.routingNumber"),
          align: "center",
          value: "routingNumber",
        },
        {
          text: this.$t("bank-account-properties.accountType"),
          align: "center",
          value: "bankAccountType",
        },
        {
          text: this.$t("common.state"),
          align: "center",
          value: "bankAccountState",
        },
        {
          text: this.$t("common.seeMore"),
          align: "center",
          value: "details",
        },
      ];
    },
    mungedData() {
      return this.fetchedData.map(data => {
        const bankAccountState = {
          name: data.clientBankAccount[0].stateBankAccount[0].state.name,
          translated: this.$tc(
            `state-name.${data.clientBankAccount[0].stateBankAccount[0].state.name}`
          ),
        };
        const bankAccountType = this.$tc(
          `bank-account-properties.${data.type.toLowerCase()}`
        );
        return {
          ...data,
          nickname: data.nickname.toUpperCase(),
          id: data.idBankAccount,
          routingNumber: data.routingNumber.number,
          bankAccountType,
          bankAccountState,
          number: "XXXX-".concat(data.accountNumber),
        };
      });
    },
  },
  methods: {
    async deleteItem(id) {
      const bankAccount = this.fetchedData.find(
        bankAccount => bankAccount.idBankAccount === id
      );

      this.fetchedData.splice(this.fetchedData.indexOf(bankAccount), 1);
    },
    async updateBankAccountState(item) {
      this.showLoadingScreen = true;
      let state = "";
      let stateTranslated = "";
      if (item.bankAccountState.name === states.ACTIVE.name) {
        state = states.BLOCKED.name;
        stateTranslated = states.BLOCKED.name;
      } else {
        state = states.ACTIVE.name;
        stateTranslated = states.ACTIVE.name;
      }
      await this.$http.put(`bank-account/state`, {
        idUserClient: item.clientBankAccount[0].userClient.idUserClient,
        idBankAccount: item.idBankAccount,
        state: state,
      }).finally(() => {
        this.showLoadingScreen = false;
      });
      item.bankAccountState.name = state;
      item.bankAccountState.translated = stateTranslated;      
    },
  },
};
</script>
