<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        Hello World Centrado
        <router-link to="/user-detail">
          <button>userDetails</button>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "hello-world",
  data() {
    return {};
  },
};
</script>
