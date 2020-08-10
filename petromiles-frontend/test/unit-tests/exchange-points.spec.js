import { shallowMount } from "@vue/test-utils";
import ExchangePointsForm from "@/components/Withdrawal/ExchangePointsForm";

//import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
//import vuetify from "@/plugins/vuetify";
//import i18n from "@/i18n";
//import httpClient from "@/http/http-client";

//Vue.config.productionTip = false;
//Vue.prototype.$http = httpClient;
import Vue from "vue";
import VueI18n from "vue-i18n";
import Vuetify from "vuetify/lib";
Vue.use(VueI18n);
Vue.use(Vuetify);
const i18n = new VueI18n();
const vuetify = new Vuetify();

describe("ExchangePointsForm", () => {
  let bankAccounts;
  let onePointToDollars;
  let interests;
  let totalPoints;
  let loadBankAccounts;
  let loadRate;
  let loadInterests;
  let loadPoints;
  let wrapper;

  beforeEach(async () => {
    const $t = () => {};
    const $tc = () => {};
    wrapper = shallowMount(ExchangePointsForm, {
      router,
      store,
      vuetify,
      i18n,
      render: h => h(App),
    });
    //wrapper = new Vue(ExchangePointsForm).$mount();
  });

  describe("case: success", () => {
    describe("when everything works well", () => {
      beforeEach(async () => {
        bankAccounts = [
          {
            idClientBankAccount: 1,
            nickname: "prueba",
            last4: "1111",
          },
        ];
        onePointToDollars = 0.002;
        interests = [
          { amount: 0, percentage: 0.05 },
          { amount: 75, percentage: 0 },
        ];
        totalPoints = 10000;
        //wrapper.setData({
        //  bankAccounts,
        //  onePointToDollars,
        //  interests,
        //  totalPoints,
        //});
        wrapper.$el.loadBankAccounts = jest
          .fn()
          .mockResolvedValue(bankAccounts);
        wrapper.loadRate = jest.fn().mockResolvedValue(onePointToDollars);
        wrapper.loadInterests = jest.fn().mockResolvedValue(interests);
        wrapper.loadPoints = jest.fn().mockResolvedValue(totalPoints);

        /*loadBankAccounts.mockImplementation(() => {
          this.bankAccounts = bankAccounts;
        });
        loadRate.mockImplementation(() => {
          this.onePointToDollars = onePointToDollars;
        });
        loadInterests.mockImplementation(() => {
          this.interests = interests;
        });
        loadPoints.mockImplementation(() => {
          this.totalPoints = totalPoints;
        });*/
      });

      it("has a created hook", () => {
        expect(typeof ExchangePointsForm.created).toBe("function");
      });

      it("check default values", () => {
        expect(wrapper.vm.loadBankAccounts).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.bankAccounts).toBe(bankAccounts);
        expect(wrapper.vm.onePointToDollars).toBe(onePointToDollars);
        expect(wrapper.vm.interests).toBe(interests);
        expect(wrapper.vm.totalPoints).toBe(totalPoints);
      });

      it("execute", async () => {
        wrapper.setData({
          points: "2000",
          selectedBankAccount: bankAccounts[0].idClientBankAccount,
        });
        await wrapper.findComponent({ name: "exchange" }).trigger("click");
      });
    });
  });
});
