"use client";
import { useState, useEffect } from "react";
import { FaSmile } from "react-icons/fa";
import {
  GiFeather,
  GiBookshelf,
  GiScrollUnfurled,
  GiTalk,
  GiOpenBook,
  GiGraduateCap,
  GiBrain,
  GiQuillInk,
  GiArchiveResearch,
} from "react-icons/gi";
import { useApp } from "./ThemeLangContext";
import { useContent } from "./ContentProvider";
import { Sun, Moon } from "lucide-react";

// 🧠 Hook personalizado para detectar móvil
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

// 🧩 Tipado
interface MenuItem {
  label: string;
  id: string;
}

interface NavbarLangContent {
  menu: MenuItem[];
}

export default function Navbar() {
  const { lang, theme, toggleTheme, toggleLang } = useApp();
  const { content } = useContent() as { content: { navbar?: NavbarLangContent } };
  const isMobile = useIsMobile();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 📜 Contenido dinámico
  const defaultMenus: Record<string, NavbarLangContent> = {
    es: {
      menu: [
        { label: "Bienvenidos", id: "bienvenidos" },
        { label: "Acerca de mí", id: "acercademi" },
        { label: "Tecnologías", id: "tecnologias" },
        { label: "Mis Proyectos", id: "misproyectos" },
        { label: "Testimonios", id: "testimonios" },
        { label: "CV", id: "cv" },
        { label: "Experiencia Académica y Laboral", id: "experiencia" },
        { label: "Mi Filosofía de Vida", id: "filosofia" },
        { label: "Contacto", id: "contacto" },
        { label: "Pie de Página", id: "PieDePágina" },
      ],
    },
    en: {
      menu: [
        { label: "Welcome", id: "bienvenidos" },
        { label: "About Me", id: "acercademi" },
        { label: "Technologies", id: "tecnologias" },
        { label: "My Projects", id: "misproyectos" },
        { label: "Testimonials", id: "testimonios" },
        { label: "Resume", id: "cv" },
        { label: "Academic & Work Experience", id: "experiencia" },
        { label: "My Life Philosophy", id: "filosofia" },
        { label: "Contact", id: "contacto" },
        { label: "Footer", id: "PieDePágina" },
      ],
    },
  };

  const navbarContent = content?.navbar ?? defaultMenus[lang] ?? defaultMenus["en"];

  // 🧱 Íconos
  const icons = [
    <FaSmile key="1" />,
    <GiFeather key="2" />,
    <GiBookshelf key="3" />,
    <GiScrollUnfurled key="4" />,
    <GiTalk key="5" />,
    <GiOpenBook key="6" />,
    <GiGraduateCap key="7" />,
    <GiBrain key="8" />,
    <GiQuillInk key="9" />,
    <GiArchiveResearch key="10" />,
  ];

  // 🎯 Selección y sonido
  const playMenuSound = () => {
    const audio = new Audio("/sounds/menu.mp3");
    audio.play().catch(() => {});
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    playMenuSound();
    if (isMobile) setMenuOpen(false);
  };

  const bgMain = theme === "dark" ? "bg-black" : "bg-white";
  const bgItem = theme === "dark" ? "bg-black text-white" : "bg-[#f5f5f5] text-black";
  const textMenu = theme === "dark" ? "text-[#d4af37]" : "text-black";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 shadow-lg transition-all duration-500 ${bgMain}`}>
      {/* 🔘 Botón menú móvil */}
      <div
        className="flex items-center px-4 py-2 md:hidden cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`font-bold text-lg transition-colors duration-300 ${textMenu}`}>☰ Menú</span>
      </div>

      {/* 📱 Menú móvil (fondo dorado completo) */}
      <div
        className={`fixed top-14 left-0 w-full h-[calc(100vh-56px)] bg-[#d4af37] shadow-xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2 p-4 h-full justify-between">
          <div className="flex flex-col gap-3">
            {navbarContent.menu.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => handleSelect(index)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedIndex === index
                    ? "border-red-600 shadow-[0_0_15px_rgba(255,0,0,0.5)] scale-105"
                    : "border-transparent hover:border-red-600 hover:shadow-[0_0_10px_rgba(255,0,0,0.4)] hover:scale-105"
                } ${bgItem}`}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#d4af37] text-black">
                  {icons[index]}
                </div>
                <span className="font-['Irish_Grover'] text-sm hover:text-[#d4af37] hover:drop-shadow-[0_0_6px_gold] transition-all">
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* 🌗 Idioma y tema (al fondo, dentro del mismo fondo dorado) */}
          <div className="flex justify-center gap-3 mt-6 pb-4">
            <button
              onClick={toggleLang}
              className="px-3 py-2 bg-black text-[#d4af37] rounded-xl hover:bg-red-600 hover:text-white transition-all"
            >
              🌐 {lang === "es" ? "EN" : "ES"}
            </button>
            <button
              onClick={toggleTheme}
              className="px-3 py-2 bg-black text-[#d4af37] rounded-xl hover:bg-red-600 hover:text-white transition-all"
            >
              {theme === "light" ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      </div>

      {/* 🖥 Escritorio */}
      <div className="hidden md:block md:px-2 md:pt-2">
        <div className="max-w-[99%] mx-auto px-4 py-2 bg-[#d4af37] transition-all duration-500">
          <div className="grid grid-cols-11 gap-2 max-w-7xl mx-auto">
            {navbarContent.menu.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onMouseEnter={() => !isMobile && setSelectedIndex(index)}
                onMouseLeave={() => !isMobile && setSelectedIndex(null)}
                onClick={() => handleSelect(index)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedIndex === index
                    ? "border-red-600 shadow-[0_0_15px_rgba(255,0,0,0.5)] scale-105"
                    : "border-transparent hover:border-red-600 hover:shadow-[0_0_10px_rgba(255,0,0,0.4)] hover:scale-105"
                } ${bgItem}`}
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#d4af37] text-black">
                  {icons[index]}
                </div>
                <span className="font-['Irish_Grover'] text-xs sm:text-sm hover:text-[#d4af37] hover:drop-shadow-[0_0_6px_gold] transition-all">
                  {item.label}
                </span>
              </a>
            ))}

            {/* 🌐 Botones dentro del fondo dorado */}
            <div className="flex items-center justify-center gap-3 px-3 py-1 rounded-xl border border-transparent hover:border-red-600 transition-all duration-300 bg-[#d4af37]">
              <button
                onClick={toggleLang}
                className="px-2 py-1 bg-black text-[#d4af37] rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs sm:text-sm"
              >
                🌐 {lang === "es" ? "EN" : "ES"}
              </button>
              <button
                onClick={toggleTheme}
                className="px-2 py-1 bg-black text-[#d4af37] rounded-xl hover:bg-red-600 hover:text-white transition-all"
              >
                {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
