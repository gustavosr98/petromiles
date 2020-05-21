<template>
  <div>
    <v-row>
      <v-col class="py-1">
        <div class="d-flex justify-center">
          <balance-option :header="$t('user-balance.myPoints')" :value="points.points" type />
          <div class="mr-5">
            <v-icon color="secondary">sync_alt</v-icon>
          </div>
          <balance-option :header="$t('user-balance.equivalent')" :value="points.dollars" type="$" />
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </div>
</template>

<script>
import BalanceOption from "@/modules/Transaction/components/BalanceOption";
export default {
  components: {
    "balance-option": BalanceOption,
  },
  data() {
    return {
      points: {},
    };
  },

  async mounted() {
    this.points = await this.$http.get("user/points/conversion");
  },
};
</script>