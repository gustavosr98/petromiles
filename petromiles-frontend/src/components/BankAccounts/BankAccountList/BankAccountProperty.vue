<template>
  <div class="d-flex align-center justify-space-between font-weight-light">
    <div class="text-capitalize">{{field}}</div>
    <div :class="`font-weight-bold ${color}--text`">{{data }}</div>
  </div>
</template>


<script>
export default {
  props: {
    field: { type: String, required: true },
    data: { type: String, required: true },
    color: { type: String },
  },
};
</script>