<template>
  <div class="mr-4">
    <div class="caption grey--text lighten-4">{{ header }}</div>
    <p class="mb-0 font-weight-bold">
      {{ value }}
      <span class="black--text caption">{{ type }}</span>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    header: { type: String, required: true },
    value: { required: true },
    type: { type: String, required: true },
  },
};
</script>
