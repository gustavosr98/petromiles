<template>
  <v-col cols="12" md="6" class>
    <v-card-text class="mt-12">
      <h5 class="text-center overline">{{ msg }}</h5>
      <h1 class="text-center .subtitle-1 text-uppercase">{{ title }}</h1>
    </v-card-text>
    <v-img
      :src="require('../../../assets/home_petromiles.png')"
      alt="Picture of the fidelity program PetroMiles"
    />
  </v-col>
</template>
<script>
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
};
</script>

<style lang="scss" scoped></style>
