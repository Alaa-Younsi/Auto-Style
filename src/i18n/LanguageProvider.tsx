import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import translations, { type Lang, type TranslationKey, type Translations } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  tf: <K extends TranslationKey>(key: K, ...args: Translations[K] extends ((...a: infer A) => string) ? A : never[]) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("lang");
    return stored === "ar" ? "ar" : "fr";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : "fr";
    document.documentElement.dir = dir;
    localStorage.setItem("lang", lang);
  }, [lang, dir]);

  const setLang = (newLang: Lang) => setLangState(newLang);

  const t = (key: TranslationKey): string => {
    const val = translations[lang][key];
    if (typeof val === "function") return key;
    return val as string;
  };

  const tf = <K extends TranslationKey>(
    key: K,
    ...args: Translations[K] extends ((...a: infer A) => string) ? A : never[]
  ): string => {
    const val = translations[lang][key];
    if (typeof val === "function") {
      return (val as (...a: unknown[]) => string)(...(args as unknown[]));
    }
    return val as string;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tf, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
