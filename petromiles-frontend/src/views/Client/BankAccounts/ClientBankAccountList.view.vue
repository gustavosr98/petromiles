<template>
  <client-layout>
    <sub-navbar :items="items" @changeComponent="changeComponent" />
    <bank-account-table v-if="active === 0" />
    <bank-account-creation @finish="finish" v-if="active === 1" />
    <bank-account-verification @finish="finish" v-if="active === 2" />
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import BankAccountCreation from "@/components/BankAccounts/BankAccountCreation/BankAccountCreation";
import BankAccountsTable from "@/components/BankAccounts/BankAccountList/BankAccountsTable";
import BankAccountVerification from "@/components/BankAccounts/BankAccountVerification/BankAccountVerification";

import SubNavBar from "@/components/General/Navigation/SubNavBar";
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
          label: "navbar.bankAccount",
          icon: "mdi-cash",
        },
        {
          label: "bank-account-creation.newBankAccount",
          icon: "mdi-plus",
        },
        {
          label: "bank-account-creation.bankAccountVerification",
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
