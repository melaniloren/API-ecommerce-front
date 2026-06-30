import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n/i18n";

// Selector de idioma: cambia el idioma activo de i18next, que persiste
// automáticamente en localStorage (ver detection.caches en i18n.js).
function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLang = (i18n.language || "es").split("-")[0];

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <select
      className="language-switcher"
      value={currentLang}
      onChange={handleChange}
      aria-label={t("navbar.language")}
      title={t("navbar.language")}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
