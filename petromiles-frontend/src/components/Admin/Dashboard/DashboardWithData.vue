<template>
  <v-row align="center" justify="center">
    <v-col cols="12" md="3" align="center">
      <bank-account-info :bankAccountsData="bankAccountsData" />
    </v-col>
    <v-col cols="12" md="3">
      <v-col cols="10">
        <bank-account-graph :bankAccountsData="bankAccountsData" />
      </v-col>
    </v-col>
    <v-col cols="12" md="3" align="center">
      <users-info :usersData="usersData" />
    </v-col>
    <v-col cols="12" md="3">
      <v-col cols="10">
        <users-graphic :usersData="usersData" />
      </v-col>
    </v-col>
  </v-row>
</template>
<script>
import BankAccountsInformation from "@/components/Admin/Dashboard/BankAccountsInformation.vue";
import BankAccountsGraph from "@/components/Admin/Dashboard/BankAccountsGraphic.vue";
import UsersInformation from "@/components/Admin/Dashboard/UsersInformation.vue";
import UsersGraphic from "@/components/Admin/Dashboard/UsersGraphic.vue";
export default {
  props: {
    bankAccountsData: { type: Object, required: true },
    usersData: { type: Object, required: true },
  },
  components: {
    "bank-account-info": BankAccountsInformation,
    "bank-account-graph": BankAccountsGraph,
    "users-info": UsersInformation,
    "users-graphic": UsersGraphic,
  },
};
</script>