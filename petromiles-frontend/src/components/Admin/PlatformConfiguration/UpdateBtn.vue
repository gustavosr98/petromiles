<template>
  <v-col cols="3">
    <v-btn color="secondary" class="white--text" @click="update" :loading="loading">
      {{ $t("configuration.update") }}
      <v-icon class="ml-3" x-small right dark>mdi-pencil</v-icon>
    </v-btn>
  </v-col>
</template>
<script>
export default {
  props: {
    loading: { type: Boolean, required: true },
  },
  methods: {
    update() {
      this.$emit("update");
    },
  },
};
</script>