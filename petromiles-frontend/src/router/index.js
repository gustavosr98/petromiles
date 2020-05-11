import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/modules/Example/views/Home.vue";
import Login from "@/modules/Auth/views/Login.vue";
import SignUp from "@/modules/Auth/views/SignUp.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "@/modules/Example/views/About.vue"
      ),
  },
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
