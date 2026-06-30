import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// El contenido de la base de datos (nombres y descripciones de recetas/productos)
// está escrito en español. Cuando el idioma activo no es español, traducimos
// usando la API MyMemory y cacheamos el resultado en
// localStorage para no repetir la misma traducción en cada render/recarga.
// Todavia no está implementado, solo están las traducciones de los textos estáticos de la app (navbar, botones, etc.) en los archivos JSON de i18n.
const CACHE_PREFIX = "recetaMarket:dynTranslation:";

const getCacheKey = (text, lang) => `${CACHE_PREFIX}${lang}:${text}`;

const translateWithMyMemory = async (text, targetLang) => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text,
  )}&langpair=es|${targetLang}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo traducir el texto");
  }

  const data = await response.json();
  return data?.responseData?.translatedText || text;
};

/**
 * Traduce un texto dinámico (proveniente de la base de datos) al idioma activo.
 * Si el idioma activo es español, devuelve el texto original sin llamar a la API.
 * Usa caché en localStorage para evitar pedidos repetidos.
 */
export function useTranslatedText(text) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "es").split("-")[0];
  const [translated, setTranslated] = useState(text ?? "");

  useEffect(() => {
    if (!text) {
      setTranslated(text ?? "");
      return;
    }

    if (lang === "es") {
      setTranslated(text);
      return;
    }

    const cacheKey = getCacheKey(text, lang);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTranslated(cached);
      return;
    }

    let cancelled = false;
    // Mientras llega la traducción mostramos el texto original (en español)
    // para no dejar el campo vacío.
    setTranslated(text);

    translateWithMyMemory(text, lang)
      .then((result) => {
        if (cancelled) return;
        localStorage.setItem(cacheKey, result);
        setTranslated(result);
      })
      .catch(() => {
        if (!cancelled) setTranslated(text);
      });

    return () => {
      cancelled = true;
    };
  }, [text, lang]);

  return translated;
}

/**
 * Componente helper para usar en JSX: renderiza el texto dinámico ya traducido
 * dentro de la etiqueta indicada en `as` (por defecto un <span>).
 * Si se pasa `truncate`, recorta el texto YA TRADUCIDO a esa cantidad de
 * caracteres (truncar el original y traducir el recorte puede cortar palabras
 * a la mitad en otros idiomas).
 * Ejemplo: <TranslatedText as="h3" text={receta.nombre} />
 */
export function TranslatedText({ text, as: Component = "span", truncate, ...props }) {
  const translated = useTranslatedText(text);
  const display =
    truncate && translated.length > truncate
      ? `${translated.substring(0, truncate)}...`
      : translated;
  return <Component {...props}>{display}</Component>;
}
