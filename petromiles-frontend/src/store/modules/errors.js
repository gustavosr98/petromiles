export const namespaced = true;
export const state = {
  lastError: null,
};

export const mutations = {
  setNewError(state, newError) {
    state.lastError = newError;
  },
  clearLastError(state) {
    state.lastError = null;
  },
};

export const actions = {};
