import { validationMixin } from "vuelidate";
import { required, numeric, integer, minValue } from "vuelidate/lib/validators";
import validationMessagges from "@/mixins/validation-forms/validation-messages.mixin";

export default {
  mixins: [validationMixin, validationMessagges],
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
      return errors;
    },
    selectedBankAccountErrors() {
      let errors = [];
      if (!this.$v.selectedBankAccount.$dirty) return errors;
      !this.$v.selectedBankAccount.required && errors.push(this.thisIsRequired);
      return errors;
    },
    // i18n Transaltions
    minValue() {
      return this.$tc("error-messages.minValue", 1, { min: 1 });
    },
  },
};
