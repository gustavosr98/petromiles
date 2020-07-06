import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  minLength,
} from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  validations: {
    firstName: { required },
    lastName: { required },
    email: { required, email },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email &&
        errors.push(`${this.$tc("error-messages.ValidEmail")}`);
      !this.$v.email.required &&
        errors.push(`${this.$tc("error-messages.EmailRequired")}`);
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.required &&
        errors.push(`${this.$tc("error-messages.FirstNameRequired")}`);
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required &&
        errors.push(`${this.$tc("error-messages.LastNameRequired")}`);
      return errors;
    },
  },
};
