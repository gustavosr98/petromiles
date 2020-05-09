import httpClient from "@/http/http-client";

export const namespaced = true;
export const state = {
  user: null,
};

export const mutations = {
  SET_USER_DATA(state, userData) {
    //1) Se guarda usuario en el state
    state.user = {
      email: userData.email,
      details: userData.userDetails,
      language: userData.language,
      role: userData.role,
    };
    console.log(state.user);

    // 2) Se guarda usuario en el storage para mantener datos si se recarga la pagina
    localStorage.setItem("user", `Bearer ${JSON.stringify(userData.token)}`);

    // 3) Se coloca el token en el header para mandarlo al backend en todas las peticiones
    httpClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userData.token}`;
  },

  LOG_OUT() {
    localStorage.removeItem("user");
    location.reload();
  },
};

export const actions = {
  async signUp({ commit }, credentials) {
    // Realizamos peticion al backend para crear usuario
    await httpClient.post("api/v1/auth/signup", credentials).then(data => {
      commit("SET_USER_DATA", data);
      console.log("User is signed");
    });
  },
  async logIn({ commit }, credentials) {
    await httpClient.post("api/v1/auth/login", credentials).then(data => {
      commit("SET_USER_DATA", data);
      console.log("User is signed");
    });
  },

  logout({ commit }) {
    commit("LOG_OUT");
  },
};

export const getters = {
  loggedIn(state) {
    return !!state.user;
  },
};
