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
