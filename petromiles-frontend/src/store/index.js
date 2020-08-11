import Vue from "vue";
import Vuex from "vuex";
import * as auth from "@/store/Auth/auth";
import * as bankAccount from "@/store/BankAccounts/bankAccount";
import * as errors from "@/store/Alerts/errors";
import createPlugin from "logrocket-vuex";
import LogRocket from "logrocket";

Vue.use(Vuex);
const logrocketPlugin = createPlugin(LogRocket);
LogRocket.init(process.env.LOGROCKET_ID, {
  dom: {
    inputSanitizer: true,
  },
});

export default new Vuex.Store({
  modules: {
    auth,
    bankAccount,
    errors,
  },
  plugins: [logrocketPlugin],
});
