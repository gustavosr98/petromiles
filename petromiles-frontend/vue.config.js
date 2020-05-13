module.exports = {
  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
  pwa: {
    name: "PetroMiles",
    themeColor: "#1B3D6E",
    msTileColor: "#1B3D6E",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      version: "0.0.1",
      description: "A platform to earn and exchagen customer points",
    },
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon.png",
      maskIcon: "img/icons/favicon-32x32.png",
      msTileImage: "img/icons/mstile-150x150.png",
    },
  },
};
