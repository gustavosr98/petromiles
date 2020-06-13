import { validationMixin } from "vuelidate";
import { required, numeric, integer, minValue } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  validations: {
    points: {
      required,
      numeric,
      integer,
      minValue: minValue(1),
    },
    selectedBankAccount: {
      required,
    },
    totalPointsRest: {
      numeric,
    },
  },
  computed: {
    // Error stacks
    pointsErrors() {
      let errors = [];
      if (!this.$v.points.$dirty) return errors;
      !this.$v.points.required && errors.push(this.thisIsRequired);
      !this.$v.points.integer && errors.push(this.shouldBeInteger);
      !this.$v.points.numeric && errors.push(this.shouldBeNumber);
      !this.$v.points.minValue && errors.push(this.minValue);
      !this.$v.totalPointsRest.numeric && errors.push(this.minValueRest);
      return errors;
    },
    selectedBankAccountErrors() {
      let errors = [];
      if (!this.$v.selectedBankAccount.$dirty) return errors;
      !this.$v.selectedBankAccount.required && errors.push(this.thisIsRequired);
      return errors;
    },
    // i18n Transaltions
    thisIsRequired() {
      return this.$t("error-messages.required");
    },
    shouldBeNumber() {
      return this.$t("error-messages.shouldBeNumber");
    },
    shouldBeInteger() {
      return this.$t("error-messages.shouldBeInteger");
    },
    minValue() {
      return this.$tc("error-messages.minValue", 1, { min: 1 });
    },
    minValueRest() {
      return this.$t("error-messages.minValueRest");
    },
  },
};
