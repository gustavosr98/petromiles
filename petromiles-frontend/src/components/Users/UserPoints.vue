<template>
  <div class="text-center">
    <v-col cols="12">
      <h3>{{ $t("profile.PointsAvailable") }}</h3>
      <h1 class="pointsText">{{conversion.points}}</h1>
      <h3>{{ $t("profile.PointsInDollars") }}</h3>
      <h1 class="dolarsText">${{dollars}}</h1>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    conversion: {
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      points: 0,
      dollars: 0,
    };
  },
  async mounted() {
    const conversion = await this.$http.get("/payments/one-point-to-dollars");

    this.dollars =
      Math.round(
        this.conversion.points * conversion.onePointEqualsDollars * 100
      ) / 100;
  },
};
</script>

<style lang="scss" scoped>
.pointsText {
  font-size: 30px;
  color: blue;
  margin-bottom: 5%;
}
.dolarsText {
  margin-bottom: 20%;
  font-size: 30px;
  color: green;
}
</style>