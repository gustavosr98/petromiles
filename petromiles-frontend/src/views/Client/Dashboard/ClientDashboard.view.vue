<template>
  <client-layout>
    <v-row justify="center" align="center">
      <v-col xs="10" sm="10" md="6" justify="center" align="center" class="pt-lg-12">
        <v-img :src="wallet" alt="Wallet" />
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" justify="center" align="center" class="pt-lg-6">
        <h3>{{$t("dashboard.wellcome")}}</h3>
      </v-col>
    </v-row>
  </client-layout>
</template>

<script>
import ClientLayout from "@/components/Client/ClientLayout/ClientLayout";
import Wallet from "@/assets/Wallet.png";

export default {
  name: "client-dashboard",
  components: {
    "client-layout": ClientLayout,
  },
  data() {
    return {
      wallet: Wallet,
    };
  },
};
</script>
