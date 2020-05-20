import "@fortawesome/fontawesome-free/css/all.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import minifyTheme from "minify-css-string";

import es from "vuetify/es5/locale/es";
import en from "vuetify/es5/locale/en";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { en, es },
    current: "en",
  },
  theme: {
    options: {
      customProperties: true,
      minifyTheme,
      themeCache: {
        get: key => localStorage.getItem(key),
        set: (key, value) => localStorage.setItem(key, value),
      },
    },
    icons: {
      iconfont: "md" || "fa" || "mdi",
    },
    themes: {
      light: {
        primary: "#1B3D6E",
        secondary: "#FCB526",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
});
