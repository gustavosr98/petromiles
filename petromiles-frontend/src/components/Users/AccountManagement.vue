<template>
  <div>
    <br />
    <v-divider></v-divider>
    <br />
    <h3 class="text-center">{{$t("profile.accountManagement")}}</h3>
    <p class="text-center">{{$t("profile.closeAccountPermanently")}}</p>

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="11" md="9" class="ml-4 mb-8">
        <p class="mb-0 pb-0">{{$t("profile.closeYourAccount")}}</p>
        <p class="mt-0 pt-0">
          <strong>{{$t("profile.warning")}}:</strong>
          {{$t("profile.closeAccountWarning")}}
        </p>
        <v-checkbox v-model="deleteUserData" :label="checkBoxMessage"></v-checkbox>
        <v-btn outlined @click="openModal" color="indigo">{{$t("profile.closeAccountBtn")}}</v-btn>
      </v-col>

      <v-spacer></v-spacer>
      <are-you-sure-modal
        :showModal="showModal"
        @makeAction="closeAccount"
        @closeModal="closeModal"
        :loading="loading"
      ></are-you-sure-modal>
    </v-row>
  </div>
</template>
<script>
import AreYouSureModal from "@/components/General/Modals/WarningModals/AreYouSureModal";

import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("auth");
export default {
  name: "account-management",
  components: {
    "are-you-sure-modal": AreYouSureModal,
  },
  data() {
    return {
      deleteUserData: false,
      showModal: false,
      loading: false,
    };
  },
  methods: {
    ...mapMutations(["logout"]),
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.loading = false;
    },
    async closeAccount() {
      this.loading = true;

      await this.$http
        .put("user/close-account", {
          deleteUserData: this.deleteUserData,
        })
        .then(() => {
          this.logout();
        })
        .finally(() => {
          this.showModal = false;
          this.loading = false;
        });
    },
  },
  computed: {
    checkBoxMessage: function () {
      return this.$t("profile.deleteDataCheck");
    },
  },
};
</script>