<template>
  <div>
    <v-row>
      <v-col class="py-1 mb-5">
        <div class="d-flex justify-center">
          <balance-option
            :header="$t('user-balance.myPoints')"
            :value="Math.round(points.points)"
            type
          />
          <div class="mr-5">
            <v-icon color="secondary">sync_alt</v-icon>
          </div>
          <balance-option :header="$t('user-balance.equivalent')" :value="dollars" type="$" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BalanceOption from "@/components/Transactions/BalanceOption";
export default {
  components: {
    "balance-option": BalanceOption,
  },
  data() {
    return {
      points: {},
      dollars: null,
    };
  },

  async mounted() {
    this.points = await this.$http.get("user/points/conversion");
    const conversion = await this.$http.get("/payments/one-point-to-dollars");

    this.dollars =
      Math.round(this.points.points * conversion.onePointEqualsDollars * 100) /
      100;
  },
};
</script>
