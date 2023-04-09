const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "ar",
    locales: ["en", "ar"],
    localeDetection: false,
    localePath: path.resolve("./public/locales"),
  },
};
