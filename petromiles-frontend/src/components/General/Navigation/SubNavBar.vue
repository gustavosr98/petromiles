<template>
  <v-bottom-navigation :value="0" class="elevation-0 mb-3" color="primary lighten-1">
    <v-btn v-for="(item, index) in items" :key="index" @click="change(index)">
      <span>{{$tc(item.label)}}</span>
      <v-icon>{{item.icon}}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  props: {
    items: { required: true },
  },
  methods: {
    change(index) {
      this.$emit("changeComponent", index);
    },
  },
};
</script>

<style scoped>
</style>