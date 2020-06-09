<template>
  <v-col cols="12" md="6" class>
    <v-card-text class="mt-12">
      <h5 class="text-center overline">{{ msg }}</h5>
      <h1 class="text-center .subtitle-1 text-uppercase">{{ title }}</h1>
    </v-card-text>
    <v-img :src="image" alt="Picture of the fidelity program PetroMiles" />
  </v-col>
</template>

<script>
import Image from "@/assets/home_petromiles.png";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      image: Image,
    };
  },
};
</script>
