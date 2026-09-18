import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import copy from "@/data/copy.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: copy },
  },
});

export default i18n;
