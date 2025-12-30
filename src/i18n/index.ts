import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import vi from "./locales/vi.json"
import en from "./locales/en.json"

const resources = {
  vi: {
    translation: vi,
  },
  en: {
    translation: en,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    debug: false,
    detection: {
      // Ưu tiên lưu trong localStorage hoặc cookie, nếu không thì fallback
      order: ["localStorage", "cookie"],
      // Khóa dùng để lưu ngôn ngữ đã chọn
      lookupLocalStorage: "i18nextLng",
      lookupCookie: "i18next",
      
      // Không detect từ trình duyệt để tránh bị override tiếng Việt mặc định
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
