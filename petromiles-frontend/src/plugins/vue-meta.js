import Vue from "vue";
import VueMeta from "vue-meta";

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

export default {
  title: "PetroMiles",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { description: "A platform to earn and exchagen customer points" },
    { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
    {
      name: "keywords",
      content: "Bank accounts, Stripe, Points, Client fidelity, Promotions",
    },
  ],
  noscript: [{ innerHTML: "This website requires JavaScript." }],
};
