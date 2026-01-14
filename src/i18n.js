import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/english.json"
import hi from "./locales/hindi.json"
import as from "./locales/assamese.json"
import bn from "./locales/bengali.json"
import bt from "./locales/bhutia.json"
import bo from "./locales/bodo.json"
import ks from "./locales/khasi.json"
import ko from "./locales/kokborok.json"
import me from "./locales/meitei.json"
import mi from "./locales/mizo.json"
import ne from "./locales/nepali.json"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      as: { translation: as },
      bn: { translation: bn },
      bt: { translation: bt },
      bo: { translation: bo },
      ks: { translation: ks },
      ko: { translation: ko },
      me: { translation: me },
      mi: { translation: mi },
      ne: { translation: ne }
    },
    lng: "en",          // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
