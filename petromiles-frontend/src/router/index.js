import Vue from "vue";
import VueRouter from "vue-router";

import { clientRoutesArray } from "@/router/clientRoutes";
import { adminRoutesArray } from "@/router/adminRoutes";

Vue.use(VueRouter);

const routes = [
  ...clientRoutesArray,
  ...adminRoutesArray,
  {
    path: "/i18n-example",
    name: "i18n",
    component: () =>
      import(
        /* webpackChunkName: "i18n " */ "@/components/i18n-example/HelloI18n.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
