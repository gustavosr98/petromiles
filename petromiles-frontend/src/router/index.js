import Vue from "vue";
import VueRouter from "vue-router";

import clientRoutes, { clientRoutesArray } from "@/router/clientRoutes";
import adminRoutes, { adminRoutesArray } from "@/router/adminRoutes";
import authConstants from "@/constants/authConstants";

Vue.use(VueRouter);

const routes = [...clientRoutesArray, ...adminRoutesArray];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(
    localStorage.getItem(authConstants.USER_LOCAL_STORAGE)
  );
  if (to.matched.some(record => record.meta.requiresClientAuth)) {
    // CLIENT URL PROTECTION
    if (!user || !user.authToken || user.role !== authConstants.CLIENT) {
      next({
        name: clientRoutes.LOGIN.name,
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.clientGuest)) {
    // LOGGED CLIENT REDIRECTION
    if (user && user.authToken && user.role === authConstants.CLIENT) {
      next({
        name: clientRoutes.DASHBOARD.name,
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresAdminAuth)) {
    // ADMIN URL PROTECTION
    if (!user || !user.authToken || user.role !== authConstants.ADMINISTRATOR) {
      next({
        name: adminRoutes.LOGIN.name,
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.adminGuest)) {
    // LOGGED ADMIN REDIRECTION
    if (user && user.authToken && user.role === authConstants.ADMINISTRATOR) {
      next({
        name: adminRoutes.DASHBOARD.name,
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
