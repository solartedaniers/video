"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./ThemeLangContext";
import { useContent } from "./ContentProvider";

interface HeroLang {
  brand: string;
  quote: string;
  view: string;
  language: string;
  video: string;
}

interface SiteContent {
  hero?: HeroLang;
  [key: string]: unknown;
}

export default function Hero(): React.JSX.Element {
  const { lang, toggleLang, theme, toggleTheme, setTheme } = useApp();
  const { content } = useContent() as { content: SiteContent };
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeTouch, setActiveTouch] = useState<string | null>(null);
  const [hoverVideo, setHoverVideo] = useState(false);

  const t: HeroLang =
    (content?.hero as HeroLang) ?? {
      brand: "Daniers Solarte",
      quote: "El código es mi espada,<br />la lógica mi escudo.",
      view: "Ver Portafolio",
      language: lang === "es" ? "English" : "Español",
      video: "/videos/background-video.mp4",
    };

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(systemDark.matches ? "dark" : "light");
    const handleChange = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");
    systemDark.addEventListener("change", handleChange);
    return () => systemDark.removeEventListener("change", handleChange);
  }, [setTheme]);

  const handleViewClick = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch {}
    }
    router.push("/portfolio");
  };

  const handleTouchEffect = (id: string) => {
    if (!isMobile) return;
    setActiveTouch(id);
    setTimeout(() => setActiveTouch(null), 400);
  };

  const handleMouseEnter = () => {
    setHoverVideo(true);
    videoRef.current?.play();
  };
  const handleMouseLeave = () => {
    setHoverVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const isDark = theme === "dark";
  const borderColor = "border-[#d4af37]";
  const textPrimary = isDark ? "text-white" : "text-[#1c1b19]";
  const textSecondary = isDark ? "text-gray-300" : "text-[#4a4a44]";
  const bgOverlay = isDark ? "bg-black/60" : "bg-[#eae6d9]/45";
  const quoteBg = isDark ? "bg-[#121212]/80" : "bg-[#eae6d9]/85";
  const btnBg = isDark ? "bg-white/10 text-white" : "bg-[#dbd6c5]/60 text-black";

  return (
    <section
      className={`relative w-screen h-screen border-[6px] sm:border-[8px] ${borderColor} overflow-hidden grid transition-colors duration-500`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🎥 Fondo */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={t.video}
          muted
          loop
          playsInline
          autoPlay
          className={`w-full h-full object-cover transition-all duration-700 ${
            isDark ? "brightness-100" : "brightness-[0.70]"
          } ${hoverVideo ? "scale-105" : "scale-100"}`}
        />
      </div>

      {/* 🌗 Overlay */}
      <div
        className={`absolute inset-0 z-10 ${bgOverlay} transition-all duration-500`}
      />

      {/* 🔘 Controles */}
      <div className="absolute top-2 xs:top-3 sm:top-4 md:top-6 left-2 xs:left-3 sm:left-4 md:left-6 z-30 flex flex-wrap gap-2 xs:gap-3 sm:gap-4">
        <button
          onClick={toggleTheme}
          onTouchStart={() => handleTouchEffect("theme")}
          aria-label="Cambiar tema"
          className={`px-2 xs:px-3 sm:px-4 md:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full border-[1px] xs:border-[2px] shadow-md ${btnBg} ${borderColor}
            transition-all duration-300 ease-in-out text-xs xs:text-sm sm:text-base
            ${
              activeTouch === "theme"
                ? "scale-110 border-red-600 shadow-[0_0_12px_rgba(255,0,0,0.6)]"
                : "hover:scale-110 hover:border-red-600"
            }`}
        >
          {isDark ? "🌙" : "☀️"}
        </button>

        <button
          onClick={toggleLang}
          onTouchStart={() => handleTouchEffect("lang")}
          aria-label="Cambiar idioma"
          className={`px-2 xs:px-3 sm:px-4 md:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full border-[1px] xs:border-[2px] shadow-md ${btnBg} ${borderColor}
            transition-all duration-300 ease-in-out text-xs xs:text-sm sm:text-base
            ${
              activeTouch === "lang"
                ? "scale-110 border-red-600 shadow-[0_0_12px_rgba(255,0,0,0.6)]"
                : "hover:scale-110 hover:border-red-600"
            }`}
        >
          🌐 <span className="hidden xs:inline">{lang === "es" ? "English" : "Español"}</span>
          <span className="xs:hidden">{lang === "es" ? "EN" : "ES"}</span>
        </button>
      </div>

      {/* 🧍 Contenido principal */}
      <div className="absolute inset-0 z-20 grid place-items-center px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl">
          {/* Marca */}
          <h1
            onTouchStart={() => handleTouchEffect("brand")}
            className={`${textPrimary} text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 sm:mb-3 font-['Irish_Grover'] 
              transition-transform text-stroke-gold tracking-wide
              ${
                activeTouch === "brand"
                  ? "scale-110 text-stroke-red"
                  : "hover:scale-110 hover:text-stroke-red"
              } animate-pulse text-center leading-tight px-2`}
          >
            {t.brand}
          </h1>

          {/* Frase */}
          <p
            onTouchStart={() => handleTouchEffect("quote")}
            className={`${textSecondary} text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-[95%] xs:max-w-[90%] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]
              px-3 xs:px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-[20px] sm:rounded-[30px] shadow-lg ${quoteBg} font-esteban transition-transform
              ${
                activeTouch === "quote"
                  ? "scale-105 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                  : "hover:scale-105"
              }`}
            style={{
              textShadow: isDark
                ? "0 0 10px rgba(255,255,255,0.3)"
                : "0 0 8px rgba(0,0,0,0.2)",
            }}
            dangerouslySetInnerHTML={{ __html: t.quote }}
          />

          {/* Botón Portafolio */}
          <button
            onClick={handleViewClick}
            onTouchStart={() => handleTouchEffect("view")}
            className={`px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-full border-[2px] sm:border-[3px] font-bold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 
              transition-transform font-[Instrument_Serif] w-auto min-w-[200px] xs:min-w-[220px] sm:min-w-[240px]
              ${
                activeTouch === "view"
                  ? "scale-110 border-[#d4af37] shadow-[0_4px_20px_rgba(196,175,39,0.4)]"
                  : "hover:scale-110 hover:border-[#d4af37] hover:shadow-[0_4px_20px_rgba(196,175,39,0.4)]"
              }
              ${
                isDark
                  ? "bg-[#1a1a1a] text-[#d4af37]"
                  : "bg-[#dcd8c8] text-[#4a4520] border-red-600"
              }`}
          >
            {t.view}
          </button>
        </div>
      </div>

      {/* 🎵 Sonido */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/sword.mp3" type="audio/mpeg" />
      </audio>
    </section>
  );
}
