export default {
  computed: {
    thisIsRequired() {
      return this.$t("error-messages.required");
    },
    shouldBeNumber() {
      return this.$t("error-messages.shouldBeNumber");
    },
    shouldBeInteger() {
      return this.$t("error-messages.shouldBeInteger");
    },
    minValueRest() {
      return this.$t("error-messages.minValueRest");
    },
    minCostTotal() {
      return this.$t("error-messages.minCostTotal");
    },
    maxDecimals() {
      return this.$t("error-messages.maxDecimals");
    },
  },
};
