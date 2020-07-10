<template>
  <v-main class="pa-3">
    <v-row>
      <v-col cols="12" xs="5" lg="12">
        <div>
          <h1 class="text-center secondary--text text--darken-1">
            {{ fullName }}, {{ $t("dashboard.wellcome") }} 
          </h1>
          <v-divider></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="5" lg="12">
        <div>
          <h2 class="text-center primary--text text--darken-1">
            {{$t("dashboard.currentPoints")}}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="mx-auto">
      <v-col cols="12" md="10" lg="12">
        <balance class="ml-4" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <router-link to="/buy-points" class="text-decoration-none">
        <v-btn class="mb-4" x-large dark color="primary--text secondary"> <b> {{ $t("subscription.btnWantIt") }} </b> </v-btn>
      </router-link>
    </v-row>
        <v-divider></v-divider>
  </v-main>
</template>

<script>
import Balance from "@/components/Transactions/Balance";
import { mapState } from "vuex";
export default {
  name: "client-points",
  components: {
    balance: Balance,
  },
  computed: {
    ...mapState("auth", ["user"]),
    fullName: function() {
      if (!this.user) return false;
      return this.user.details.firstName;
    },
  },
};
</script>
