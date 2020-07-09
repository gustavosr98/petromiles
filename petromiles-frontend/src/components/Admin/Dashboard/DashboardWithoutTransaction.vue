<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <alert>
        <template>
          <v-col cols="12">
            <h3>{{$t('dashboard.notTransactions')}}</h3>
            <p class="mt-1">{{$t('dashboard.notTransactionsMessage')}}</p>
          </v-col>
        </template>
      </alert>
    </v-col>
    <v-col cols="12" md="4" align="center" class="py-0">
      <users-info :usersData="usersData" />
    </v-col>
    <v-col cols="12" md="4" align="center" class="py-0">
      <bank-account-info :bankAccountsData="bankAccountsData" />
    </v-col>
    <v-col cols="12" md="3" align="center" class="py-0">
      <bank-account-graph :bankAccountsData="bankAccountsData" />
    </v-col>
  </v-row>
</template>
<script>
import Alert from "@/components/General/Alerts/InformationAlert.vue";
import BankAccountsGraph from "@/components/Admin/Dashboard/BankAccountsGraphic.vue";
import UsersInformation from "@/components/Admin/Dashboard/UsersInformation.vue";
import BankAccountInformation from "@/components/Admin/Dashboard/BankAccountsInformation.vue";

export default {
  props: {
    usersData: { type: Object, required: true },
    bankAccountsData: { type: Object, required: true },
  },
  components: {
    alert: Alert,
    "users-info": UsersInformation,
    "bank-account-graph": BankAccountsGraph,
    "bank-account-info": BankAccountInformation,
  },
};
</script>