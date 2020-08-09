import { shallowMount } from "@vue/test-utils";
import ExchangePointsForm from "@/components/Withdrawal/ExchangePointsForm";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import vuetify from "@/plugins/vuetify";
import i18n from "@/i18n";
import httpClient from "@/http/http-client";

Vue.config.productionTip = false;
Vue.prototype.$http = httpClient;

const wrapper = shallowMount(ExchangePointsForm, {
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
});

describe("ExchangePointsForm", () => {
  let bankAccounts;
  let onePointToDollars;
  let interests;
  let totalPoints;
  let loadBankAccounts;
  let loadRate;
  let loadInterests;
  let loadPoints;

  beforeEach(async () => {
    loadBankAccounts = jest.fn();
    loadRate = jest.fn();
    loadInterests = jest.fn();
    loadPoints = jest.fn();
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

        loadBankAccounts.mockImplementation(() => {
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
        });
        wrapper.setMethods({
          loadBankAccounts,
          loadRate,
          loadInterests,
          loadPoints,
        });
      });

      it("has a created hook", () => {
        expect(typeof ExchangePointsForm.created).toBe("function");
      });

      it("check default values", () => {
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
        await wrapper.find({ name: "exchange" }).trigger("click");
      });
    });
  });
});
