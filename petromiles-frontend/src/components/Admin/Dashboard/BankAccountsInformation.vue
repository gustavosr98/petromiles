<template>
  <div>
    <h3>{{$t('dashboard.associatedBankAccounts')}}</h3>
    <p class="mt-8">{{ $t('dashboard.associatedBankAccountsMessage')}}</p>
    <v-card class="secondary elevation-0 mx-5 pt-2">
      <h3 class="white--text">{{$t('common.total')}}: {{ bankAccountsData.total }}</h3>
      <v-btn text class="white--text elevation-0" to="/admin/users">{{$t('dashboard.moreDetails')}}</v-btn>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    bankAccountsData: { type: Object, required: true },
  },
};
</script>