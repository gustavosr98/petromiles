import store from "../store";

const errorResponseHandler = e => {
  if (!!e.config["errorHandle"] && e.config.errorHandle === false) {
    return Promise.reject(e);
  }

  const error = e.response.data;
  store.commit("errors/setNewError", error);

  return Promise.reject(e);
};

export default errorResponseHandler;
