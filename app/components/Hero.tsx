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
      className={`relative w-full h-dvh sm:min-h-screen box-border border-[3px] sm:border-[6px] lg:border-[8px] ${borderColor}
      overflow-hidden transition-colors duration-500`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero section"
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={t.video}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700
        ${isDark ? "brightness-100" : "brightness-[0.76]"}
        ${hoverVideo ? "scale-105" : "scale-100"}`}
        aria-hidden
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 z-10 ${
          isDark ? "bg-black/60" : "bg-[#eae6d9]/45"
        }`}
        aria-hidden
      />

      {/* Buttons */}
      <div className="absolute top-3 sm:top-5 left-3 sm:left-6 z-30 flex gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          onTouchStart={() => handleTouchEffect("theme")}
          aria-label="Cambiar tema"
          className={`px-3 sm:px-5 py-1.5 rounded-full border-[2px]
          ${isDark ? "bg-white/8 text-white" : "bg-white/30 text-black"} ${borderColor}
          shadow-md text-xs sm:text-sm transition-transform
          ${activeTouch === "theme" ? "scale-110 border-red-600" : "hover:scale-110 hover:border-red-600"}`}
        >
          {isDark ? "🌙" : "☀️"}
        </button>

        <button
          onClick={toggleLang}
          onTouchStart={() => handleTouchEffect("lang")}
          aria-label="Cambiar idioma"
          className={`px-3 sm:px-5 py-1.5 rounded-full border-[2px]
          ${isDark ? "bg-white/8 text-white" : "bg-white/30 text-black"} ${borderColor}
          shadow-md text-xs sm:text-sm transition-transform
          ${activeTouch === "lang" ? "scale-110 border-red-600" : "hover:scale-110 hover:border-red-600"}`}
        >
          🌐 {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-3 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center text-center gap-4 sm:gap-6 md:gap-8 w-full max-w-[900px]">
          {/* Title */}
          <h1
            onTouchStart={() => handleTouchEffect("brand")}
            className={`font-['Irish_Grover'] leading-tight text-[2.2rem] sm:text-5xl md:text-6xl lg:text-[4.2rem]
            transition duration-300 ${activeTouch === "brand" ? "scale-105" : "hover:scale-105"}
            ${isDark ? "text-white" : "text-[#1c1b19]"}`}
            style={{
              WebkitTextStroke: "1.5px #d4af37",
              textShadow:
                "0 0 10px rgba(212,175,55,0.6), 0 0 25px rgba(212,175,55,0.3)",
            }}
          >
            {t.brand}
          </h1>

          {/* Quote */}
          <div
            onTouchStart={() => handleTouchEffect("quote")}
            className={`max-w-[95%] sm:max-w-[640px] md:max-w-[820px] px-3 sm:px-6 py-2 sm:py-4 rounded-[2rem]
            ${isDark ? "bg-[rgba(18,18,18,0.8)] text-gray-200" : "bg-[rgba(234,230,217,0.85)] text-[#4a4a44]" }
            text-xs sm:text-base md:text-lg leading-relaxed shadow-lg transition duration-300`}
            dangerouslySetInnerHTML={{ __html: t.quote }}
          />

          {/* Button */}
          <button
            onClick={handleViewClick}
            onTouchStart={() => handleTouchEffect("view")}
            className={`inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 rounded-full border-[2px] font-bold
            text-xs sm:text-base md:text-lg transition-transform
            ${activeTouch === "view" ? "scale-110 border-[#d4af37]" : "hover:scale-110"}
            ${isDark ? "bg-[rgba(26,26,26,0.9)] text-[#d4af37]" : "bg-[rgba(220,216,200,0.9)] text-[#4a4520]"}`}
          >
            {t.view}
          </button>
        </div>
      </div>

      <audio ref={audioRef} preload="auto">
        <source src="/sounds/sword.mp3" type="audio/mpeg" />
      </audio>
    </section>
  );
}
