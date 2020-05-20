<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import metaInfo from "@/plugins/vue-meta";

export default {
  name: "App",
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
