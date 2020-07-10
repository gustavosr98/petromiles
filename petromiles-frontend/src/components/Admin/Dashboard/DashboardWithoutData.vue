<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="4" align="center">
      <alert>
        <template>
          <v-col cols="12">
            <h3>{{$t('dashboard.notData')}}</h3>
            <p class="mt-4">{{$tc('dashboard.notDataMessage')}}</p>
          </v-col>
        </template>
      </alert>
    </v-col>

    <v-col cols="12" md="4" align="center">
      <users-info :usersData="usersData" />
    </v-col>
    <v-col cols="12" md="4" align="center">
      <users-graphic :usersData="usersData" />
    </v-col>
  </v-row>
</template>
<script>
import Alert from "@/components/General/Alerts/InformationAlert.vue";

import UsersInformation from "@/components/Admin/Dashboard/UsersInformation.vue";
import UsersGraphic from "@/components/Admin/Dashboard/UsersGraphic.vue";
export default {
  components: {
    "users-info": UsersInformation,
    "users-graphic": UsersGraphic,
    alert: Alert,
  },
  props: {
    usersData: { type: Object, required: true },
  },
};
</script>