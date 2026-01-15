import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/english.json"
import hi from "./locales/hindi.json"
import am from "./locales/assamese.json"
import bn from "./locales/bengali.json"
import bo from "./locales/bodo.json"
import ks from "./locales/khasi.json"
import ko from "./locales/kokborok.json"
import me from "./locales/meitei.json"
import mi from "./locales/mizo.json"
import ne from "./locales/nepali.json"

const savedLang = localStorage.getItem("lang")

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      as: { translation: am },
      bn: { translation: bn },
      bo: { translation: bo },
      ks: { translation: ks },
      ko: { translation: ko },
      me: { translation: me },
      mi: { translation: mi },
      ne: { translation: ne }
    },
    lng: savedLang || "en",          // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  })

export default i18n