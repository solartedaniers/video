"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "es";
type Theme = "light" | "dark";

interface AppContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("site-theme") as Theme | null;
    if (!storedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const storedTheme = localStorage.getItem("site-theme");
      if (!storedTheme) setTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem("site-lang") as Lang;
    const storedTheme = localStorage.getItem("site-theme") as Theme;
    if (storedLang) setLang(storedLang);
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("site-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("site-lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((s) => (s === "en" ? "es" : "en"));
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <AppContext.Provider value={{ lang, setLang, toggleLang, theme, toggleTheme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};