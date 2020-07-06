<template>
  <v-row align="center" justify="center" class="mx-auto">
    <v-col cols="12" md="10">
      <datatable
        :title="title"
        :headers="headers"
        :fetchedData="mungedData"
        @deleteItem="deleteItem"
        tableName="bank-accounts"
        :isAdmin="isAdmin"
        :clientID="clientID"
      ></datatable>
    </v-col>
  </v-row>
</template>

<script>
import Datatable from "@/components/General/Datatable/Datatable";

export default {
  name: "bank-accounts-table",
  props: {  
    isAdmin: {
      default: false
    },  
    bankAccounts: {
      default: null
    },
    clientID: {
      default: 0
    }
  },
  components: {
    Datatable,
  },
  data() {
    return {
      fetchedData: [],
    };
  },
  async mounted() {
    if(!this.bankAccounts){
      this.fetchedData = await this.$http.get("/bank-account");
      this.$store.commit("bankAccount/SET_BANK_ACCOUNTS", this.fetchedData);
    }    
    else{
      this.fetchedData = this.bankAccounts;
    }
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
  },
};
</script>
