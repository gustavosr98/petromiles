<template>
  <client-layout>
    <v-row justify="center" align="center">
      <v-col xs="10" sm="10" md="6" justify="center" align="center" class="pt-lg-12">
        <v-img :src="makeItRain" alt="Make it rain" />
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" justify="center" align="center" class="pt-lg-6">
        <h3>{{$t("sell-points.getCash")}}</h3>
      </v-col>
    </v-row>
  </client-layout>
</template>

<script>
import ClientLayout from "@/modules/Client/components/ClientLayout";
import MakeItRain from "@/assets/MakeItRain.png";

export default {
  name: "client-sell-points",
  components: {
    "client-layout": ClientLayout,
  },
  data() {
    return {
      makeItRain: MakeItRain,
    };
  },
};
</script>
