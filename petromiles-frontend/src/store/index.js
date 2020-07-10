import Vue from "vue";
import Vuex from "vuex";
import * as auth from "@/store/Auth/auth";
import * as bankAccount from "@/store/BankAccounts/bankAccount";
import * as errors from "@/store/Alerts/errors";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    bankAccount,
    errors,
  },
});
