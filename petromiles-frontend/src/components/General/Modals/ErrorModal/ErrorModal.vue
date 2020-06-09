<template>
  <v-row justify="center">
    <v-dialog :value="!!errorMessage" persistent width="300px">
      <v-card>
        <v-card-title class="headline">
          <v-icon color="red" size="50">mdi-alert</v-icon>
        </v-card-title>
        <v-card-text class="mt-2">
          {{
          $t(errorMessage)
          }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="clearLastError">
            {{
            $t("common.ok")
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "error-modal",
  methods: mapMutations("errors", ["clearLastError"]),
  computed: {
    ...mapState("errors", ["lastError"]),
    errorMessage() {
      return this.lastError?.message;
    },
  },
};
</script>


