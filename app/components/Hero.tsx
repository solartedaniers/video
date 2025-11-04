"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
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

export default function Hero(): React.JSX.Element | null {
  const { lang, toggleLang, theme, toggleTheme } = useApp();
  const { content } = useContent() as { content: SiteContent };
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeTouch, setActiveTouch] = useState<string | null>(null);
  const [hoverVideo, setHoverVideo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const t: HeroLang =
    (content?.hero as HeroLang) ?? {
      brand: "Daniers Solarte",
      quote: "El código es mi espada,<br />la lógica mi escudo.",
      view: "Ver Portafolio",
      language: lang === "es" ? "English" : "Español",
      video: "/videos/background-video.mp4",
    };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleViewClick = async (): Promise<void> => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch {
        console.warn("No se pudo reproducir el sonido.");
      }
    }
    router.push("/portfolio");
  };

  const handleTouchEffect = (id: string): void => {
    if (!isMobile) return;
    setActiveTouch(id);
    setTimeout(() => setActiveTouch(null), 400);
  };

  const handleMouseEnter = useCallback((): void => {
    setHoverVideo(true);
    videoRef.current?.play().catch(() => {});
  }, []);

  const handleMouseLeave = useCallback((): void => {
    setHoverVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const isDark = theme === "dark";
  const borderColor = "border-[#d4af37]";

  if (!isMounted) return null;

  return (
    <section
      className={`relative w-full min-h-screen box-border border-[4px] sm:border-[6px] lg:border-[8px] ${borderColor} overflow-hidden transition-colors duration-500`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero section"
    >
      {/* Video de fondo */}
      <video
        ref={videoRef}
        src={t.video}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 will-change-transform
          ${isDark ? "brightness-100" : "brightness-[0.76]"}
          ${hoverVideo ? "scale-105" : "scale-100"}`}
        aria-hidden
      />

      {/* Capa de color según el tema */}
      <div
        className={`absolute inset-0 z-10 ${
          isDark ? "bg-black/60" : "bg-[#eae6d9]/45"
        } transition-opacity duration-500`}
        aria-hidden
      />

      {/* Botones de control de idioma y tema */}
      <div className="absolute top-3 sm:top-5 left-3 sm:left-6 z-30 flex gap-2 sm:gap-4 flex-wrap">
        <button
          onClick={toggleTheme}
          onTouchStart={() => handleTouchEffect("theme")}
          aria-label="Cambiar tema"
          className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border-[2px] shadow-md 
            ${isDark ? "bg-white/8 text-white" : "bg-white/30 text-black"} ${borderColor}
            transition-transform duration-300 text-xs sm:text-sm md:text-base
            ${activeTouch === "theme" ? "scale-110 border-red-600" : "hover:scale-110 hover:border-red-600"}`}
        >
          {isDark ? "🌙" : "☀️"}
        </button>

        <button
          onClick={toggleLang}
          onTouchStart={() => handleTouchEffect("lang")}
          aria-label="Cambiar idioma"
          className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border-[2px] shadow-md 
            ${isDark ? "bg-white/8 text-white" : "bg-white/30 text-black"} ${borderColor}
            transition-transform duration-300 text-xs sm:text-sm md:text-base
            ${activeTouch === "lang" ? "scale-110 border-red-600" : "hover:scale-110 hover:border-red-600"}`}
        >
          🌐 {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      {/* Contenido principal */}
      <div className="absolute inset-0 z-20 grid place-items-center px-3 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center text-center gap-3 sm:gap-6 md:gap-8 max-w-[1100px] w-full">
          <h1
            onTouchStart={() => handleTouchEffect("brand")}
            className={`font-['Irish_Grover'] leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem]
              transition-all duration-300 ${activeTouch === "brand" ? "scale-105" : "hover:scale-105"}
              ${isDark ? "text-white" : "text-[#1c1b19]"}`}
            style={{
              webkitTextStroke: "1.5px #d4af37",
              textShadow:
                "0 0 10px rgba(212,175,55,0.6), 0 0 25px rgba(212,175,55,0.3)",
              transition: "all 0.4s ease-in-out",
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              const el = e.currentTarget.style;
              el.webkitTextStroke = "1.5px red";
              el.textShadow =
                "0 0 12px rgba(255,0,0,0.7), 0 0 24px rgba(255,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget.style;
              el.webkitTextStroke = "1.5px #d4af37";
              el.textShadow =
                "0 0 10px rgba(212,175,55,0.6), 0 0 25px rgba(212,175,55,0.3)";
            }}
          >
            {t.brand}
          </h1>

          <div
            onTouchStart={() => handleTouchEffect("quote")}
            className={`max-w-[95%] sm:max-w-[640px] md:max-w-[820px] px-4 sm:px-6 py-3 sm:py-4 rounded-[2.5rem]
              ${isDark ? "bg-[rgba(18,18,18,0.8)] text-gray-200" : "bg-[rgba(234,230,217,0.85)] text-[#4a4a44]"}
              text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed shadow-lg transition-transform duration-300
              ${activeTouch === "quote" ? "scale-102 shadow-[0_0_20px_rgba(255,215,0,0.25)]" : "hover:scale-102"}`}
            dangerouslySetInnerHTML={{ __html: t.quote }}
          />

          <div className="mt-2 sm:mt-4">
            <button
              onClick={handleViewClick}
              onTouchStart={() => handleTouchEffect("view")}
              className={`inline-flex items-center justify-center gap-3 px-5 sm:px-8 md:px-10 py-2 sm:py-3 rounded-full border-[2px] sm:border-[3px] font-bold
                transition-transform duration-300 text-sm sm:text-base md:text-lg
                ${activeTouch === "view" ? "scale-110 border-[#d4af37]" : "hover:scale-110 hover:border-[#d4af37]"}
                ${isDark ? "bg-[rgba(26,26,26,0.9)] text-[#d4af37]" : "bg-[rgba(220,216,200,0.9)] text-[#4a4520] border-red-600"}`}
            >
              {t.view}
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="auto">
        <source src="/sounds/sword.mp3" type="audio/mpeg" />
      </audio>
    </section>
  );
}
