<template>
  <v-window-item>
    <v-row align="center" justify="center">
      <welcome :title="title" :msg="msg" />
      <slot />
    </v-row>
  </v-window-item>
</template>

<script>
import Welcome from "@/components/Auth/Welcome.vue";
export default {
  components: {
    welcome: Welcome,
  },
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
