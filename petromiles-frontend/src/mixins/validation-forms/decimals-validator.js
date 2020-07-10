import { helpers } from "vuelidate/lib/validators";
export default length =>
  helpers.withParams(
    { type: "maxDecimals", max: length },
    value =>
      !helpers.req(value) ||
      new RegExp(
        `^\\s*-?(\\d+(\\.\\d{1,${length}})?|\\.\\d{1,${length}})\\s*$`
      ).test(value)
  );
