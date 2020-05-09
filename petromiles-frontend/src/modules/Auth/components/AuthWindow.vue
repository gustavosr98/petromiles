<template>
  <v-window-item>
    <v-row>
      <welcome-form :title="title" :msg="msg" />
      <slot />
    </v-row>
  </v-window-item>
</template>

<script>
import WelcomeForm from "@/modules/Auth/components/WelcomeForm.vue";
export default {
  components: {
    "welcome-form": WelcomeForm,
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
