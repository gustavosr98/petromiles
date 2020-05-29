<template>
  <client-layout>
    <sub-navbar :items="items" @changeComponent="changeComponent" />
    <bank-account-table v-if="active === 0" />
    <bank-account-creation @finish="finish" v-if="active === 1" />
    <bank-account-verification @finish="finish" v-if="active === 2" />
  </client-layout>
</template>

<script>
import ClientLayout from "@/modules/Client/components/ClientLayout";
import BankAccountCreation from "@/modules/BankAccount/components/BankAccountCreation/BankAccountCreation";
import BankAccountsTable from "@/modules/BankAccount/components/BankAccountList/BankAccountsTable";
import BankAccountVerification from "@/modules/BankAccount/components/BankAccountVerification/BankAccountVerification";

import SubNavBar from "@/components/SubNavBar";
import clientRoutes from "@/router/clientRoutes";

export default {
  name: "client-bank-account-list",
  components: {
    "client-layout": ClientLayout,
    "bank-account-creation": BankAccountCreation,
    "bank-account-table": BankAccountsTable,
    "bank-account-verification": BankAccountVerification,
    "sub-navbar": SubNavBar,
  },
  data() {
    return {
      items: [
        {
          label: this.$tc("navbar.bankAccount"),
          icon: "mdi-cash",
        },
        {
          label: this.$tc("bank-account-creation.newBankAccount"),
          icon: "mdi-plus",
        },
        {
          label: this.$tc("bank-account-creation.bankAccountVerification"),
          icon: "mdi-wrench",
        },
      ],
      active: 0,
    };
  },
  methods: {
    changeComponent(val) {
      this.active = val;
    },
    finish() {
      this.active = 0;
    },
  },
};
</script>
