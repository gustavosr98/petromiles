// Vue core
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

// Vue plugins
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";

// Http
import httpClient from "@/http/http-client";

// Others
import { firebaseConfig } from "./plugins/firebaseConfig";
import firebase from "firebase/app";
import "firebase/auth";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import LogRocket from 'logrocket';
import authConstants from "./constants/authConstants";



const user = JSON.parse(
    localStorage.getItem(authConstants.USER_LOCAL_STORAGE)
);

if (user !== null){
  const userId = toString(user.details.idUserDetails);
  const userName = user.details.firstName + ' ' + user.details.lastName;
  const userEmail = user.email;

  LogRocket.identify(userId, {
    name: userName,
    email: userEmail,
  });
}




Vue.config.productionTip = false;
Vue.prototype.$http = httpClient;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  LogRocket,
  created() {
    firebase.initializeApp(firebaseConfig);
  },
  render: h => h(App),
}).$mount("#app");
