// Vue core
import Vue from "vue";

// Vue plugins
import router from "./router";

import VueAnalytics from 'vue-analytics';

Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_ANALYTICS_ID,
  router,
});