<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <error-modal />
    </v-main>
  </v-app>
</template>

<script>
import metaInfo from "@/plugins/vue-meta";
import ErrorModal from "@/components/General/Modals/ErrorModal/ErrorModal";

export default {
  name: "App",
  components: {
    "error-modal": ErrorModal,
  },
  metaInfo,
};
</script>

<style>
/* Global develop class helpers */
.dev-a {
  background: red;
  border: solid 1px blue;
}
.dev-b {
  background: green;
  border: solid 1px purple;
}
</style>
