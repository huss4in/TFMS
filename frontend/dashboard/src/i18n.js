// i18n
import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Translations
import translationAr from "./locales/ar.json";
// import translationGr from "./locales/gr.json";
// import translationSp from "./locales/sp.json";
// import translationIt from "./locales/it.json";

if (!localStorage.getItem("I18N_LANGUAGE")) {
  localStorage.setItem("I18N_LANGUAGE", "en");
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: localStorage.getItem("I18N_LANGUAGE") || "en",
    resources: {
      en: { translation: {}, code: "en" },
      ar: { translation: translationAr, code: "ar" },
      // gr: { translation: translationGr, code: "gr" },
      // sp: { translation: translationSp, code: "sp" },
      // it: { translation: translationIt, code: "it" },
    },
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
