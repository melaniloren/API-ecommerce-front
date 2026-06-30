import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./locales/es.json";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

// Idiomas soportados por el selector. El español es el idioma base/original
// en el que está escrita la app; inglés y portugués son las traducciones.
export const SUPPORTED_LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

i18n
  .use(LanguageDetector) // detecta idioma guardado en localStorage o del navegador
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
    },
    fallbackLng: "es",
    supportedLngs: ["es", "en", "pt"],
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
    detection: {
      // Guardamos el idioma elegido en localStorage para que persista entre sesiones.
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
