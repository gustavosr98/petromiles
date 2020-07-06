<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card>
      <v-card-title class="title">{{message}}</v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="closeModal()">{{$t("configuration.accept")}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { required: true, type: Boolean },
    message: { required: true, type: String },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>