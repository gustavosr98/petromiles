import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { firebaseConfig } from "./plugins/firebaseConfig";
import firebase from "firebase/app";
import "firebase/auth";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  created() {
    firebase.initializeApp(firebaseConfig);
  },
  render: h => h(App),
}).$mount("#app");
