import { validationMixin } from "vuelidate";
import { integer, minValue, requiredIf } from "vuelidate/lib/validators";
import maxDecimals from "@/mixins/validation-forms/decimals-validator";
import validationMessagges from "@/mixins/validation-forms/validation-messages.mixin";

export default {
  mixins: [validationMixin, validationMessagges],
  data() {
    return {
      interestData: {
        id: 0,
        description: "",
        points: null,
        amount: 0,
        percentage: 0,
      },
    };
  },
  validations: {
    interestData: {
      points: {
        required: requiredIf(function() {
          return this.interestData.points !== null;
        }),
        minValue: minValue(1),
        integer,
      },
      amount: {
        required: requiredIf(function() {
          return this.interestData.amount !== null;
        }),
        minValue: minValue(0),
        maxDecimals: maxDecimals(2),
      },
      percentage: {
        required: requiredIf(function() {
          return this.interestData.percentage !== null;
        }),
        minValue: minValue(0),
        maxDecimals: maxDecimals(2),
      },
    },
  },
  computed: {
    pointsErrors() {
      let errors = [];
      if (!this.$v.interestData.points.$dirty) return errors;
      !this.$v.interestData.points.required && errors.push(this.thisIsRequired);
      !this.$v.interestData.points.minValue && errors.push(this.minValueOne);
      !this.$v.interestData.points.integer && errors.push(this.shouldBeInteger);
      return errors;
    },
    amountErrors() {
      let errors = [];
      if (!this.$v.interestData.amount.$dirty) return errors;
      !this.$v.interestData.amount.required && errors.push(this.thisIsRequired);
      !this.$v.interestData.amount.minValue && errors.push(this.minValue);
      !this.$v.interestData.amount.maxDecimals && errors.push(this.maxDecimals);

      return errors;
    },
    percentageErrors() {
      let errors = [];
      if (!this.$v.interestData.percentage.$dirty) return errors;
      !this.$v.interestData.percentage.required &&
        errors.push(this.thisIsRequired);
      !this.$v.interestData.percentage.minValue && errors.push(this.minValue);
      !this.$v.interestData.percentage.maxDecimals &&
        errors.push(this.maxDecimals);

      return errors;
    },
    minValue() {
      return this.$tc("error-messages.minValue", 1, { min: 0 });
    },
    minValueOne() {
      return this.$tc("error-messages.minValue", 1, { min: 1 });
    },
  },
};
