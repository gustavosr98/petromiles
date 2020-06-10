<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="9">
        <v-card class="elevation-12">
          <v-window>
            <user-detail msg="Welcome to Your Vue.js App" />
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import UserDetail from "@/components/Users/UserDetail.vue";

export default {
  name: "user-detail-wrapper",
  components: {
    "user-detail": UserDetail,
  },
};
</script>
