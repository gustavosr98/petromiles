<template>
  <div>
    <h3>Registered users</h3>
    <p class="mt-8 mb-0">{{ usersData.totalAdmins }} {{$tc('role.administrator', 1)}}</p>
    <p class="mt-0">{{ usersData.totalClients }} {{$tc('role.client', 1)}}</p>
    <v-card class="secondary elevation-0 mx-4 pt-2">
      <h3
        class="white--text"
      >{{$t('common.total')}}: {{ usersData.totalAdmins + usersData.totalClients }}</h3>
      <v-btn to="/admin/users" text class="white--text elevation-0">{{$t('dashboard.moreDetails')}}</v-btn>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    usersData: { type: Object, required: true },
  },
};
</script>