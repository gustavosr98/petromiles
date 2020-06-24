 <template>
  <!-- Dialog to confirm delete action -->
  <v-row justify="center">
    <v-dialog v-model="showModal" persistent max-width="60%">
      <v-card>
        <v-card-title class="headline">
          {{
          $t("common.areYouSure")
          }}
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" dark @click="closeModal">
            {{
            $t("common.cancel")
            }}
          </v-btn>
          <v-btn color="success" dark :loading="loading" @click="makeAction">
            {{
            $t("common.yes")
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    showModal: { type: Boolean, required: true },
    loading: { type: Boolean },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    makeAction() {
      this.$emit("makeAction");
    },
  },
};
</script>
