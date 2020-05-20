<template>
  <client-layout>
    <sub-navbar :items="items" @changeComponent="changeComponent" />
    <!-- Put here the component for the account list-->
    <bank-account-creation @finish="finish" v-if="active === 1" />
    <!-- Put here the component for the account verification-->
  </client-layout>
</template>

<script>
import ClientLayout from "@/modules/Client/components/ClientLayout";
import BankAccountCreation from "@/modules/BankAccount/BankAccountCreation/components/BankAccountCreation";
import SubNavBar from "@/components/SubNavBar";
import clientRoutes from "@/router/clientRoutes";

export default {
  name: "client-bank-account-list",
  components: {
    "client-layout": ClientLayout,
    "bank-account-creation": BankAccountCreation,
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
