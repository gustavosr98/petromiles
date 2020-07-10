import httpClient from "@/http/http-client";

export const namespaced = true;
export const state = {
  userDetails: null,
  bankAccount: null,
  bankAccounts: null,
};

export const mutations = {
  SET_USER_DETAILS(state, userDetailsData) {
    state.userDetails = userDetailsData;
  },

  SET_BANK_ACCOUNT(state, bankAccount) {
    state.bankAccount = bankAccount;
  },
  SET_BANK_ACCOUNTS(state, bankAccounts) {
    state.bankAccounts = bankAccounts;
  },
};

export const actions = {
  setUserDetails({ commit }, userDetailsData) {
    commit("SET_USER_DETAILS", userDetailsData);
  },
  async setBankAccount({ commit, state }, bankAccount) {
    commit("SET_BANK_ACCOUNT", bankAccount);
    const account = {
      ...bankAccount,
      userDetails: state.userDetails,
    };

    await httpClient.post("/bank-account", account);
  },
};

export const getters = {
  getBankAccountDetails(state) {
    return { bankAccount: state.bankAccount, userDetails: state.userDetails };
  },
};
