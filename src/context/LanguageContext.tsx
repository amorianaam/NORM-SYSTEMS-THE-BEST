import React, { createContext, useContext, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { Language, translations } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  t: typeof translations.en;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  refreshOverrides: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Helper to deep set object property by string path matches like "home.hero.title"
function setDeep(obj: any, path: string, value: string) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const savedLang = localStorage.getItem("norm-lang") as Language;
    if (savedLang === "en" || savedLang === "ar") {
      return savedLang;
    }
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "ar") {
      return "ar";
    }
  }
  return "en";
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [activeTranslations, setActiveTranslations] = useState(translations);

  const setLanguage = (lang: Language) => {
    const updateDOM = () => {
      setLanguageState(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("norm-lang", lang);
    };

    if (!document.startViewTransition) {
      updateDOM();
    } else {
      try {
        const transition = document.startViewTransition(() => {
          flushSync(() => {
            updateDOM();
          });
        });

        transition.finished.catch(() => {});
        transition.ready.catch(() => {});
        transition.updateCallbackDone.catch(() => {});
      } catch (e) {
        // Ignore synchronous errors
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const refreshOverrides = async () => {
    try {
      const res = await fetch("/api/content_overrides");
      const data = await res.json();
      const cloned = JSON.parse(JSON.stringify(translations));
      Object.entries(data).forEach(([path, values]: any) => {
        let mappedPath = path;
        if (mappedPath.startsWith("homePage."))
          mappedPath = mappedPath.replace("homePage.", "");
        else if (mappedPath.startsWith("global."))
          mappedPath = mappedPath.replace("global.", "");

        mappedPath = mappedPath.replace(/\.general\./g, ".");

        if (typeof values.en === "string") setDeep(cloned.en, mappedPath, values.en);
        if (typeof values.ar === "string") setDeep(cloned.ar, mappedPath, values.ar);
      });
      setActiveTranslations(cloned);
    } catch (e) {
      console.error("Failed to load CMS content overrides:", e);
    }
  };

  useEffect(() => {
    // 1. Check local storage
    const savedLang = localStorage.getItem("norm-lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguage(savedLang);
    } else {
      // 2. Check browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "ar") {
        setLanguage("ar");
      } else {
        setLanguage("en");
      }
    }

    // 3. Trigger initial load of overrides
    refreshOverrides();
  }, []);

  const value = {
    language,
    t: activeTranslations[language],
    setLanguage,
    toggleLanguage,
    refreshOverrides,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
