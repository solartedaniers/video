"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaVolumeUp } from "react-icons/fa";
import { useApp } from "./ThemeLangContext";
import { useContent } from "./ContentProvider";

// 🔊 Hook personalizado para síntesis de voz
function useSpeechSynthesis(lang: string) {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const speakText = (text: string, index: number) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeakingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const preferredLang = lang === "es" ? "es-ES" : "en-US";
    const voices = synth.getVoices();
    const maleVoice = voices.find(
      (v) =>
        v.lang === preferredLang &&
        /male|man|david|jorge|diego|miguel|pablo|john|mike/i.test(v.name)
    );
    utterance.voice = maleVoice ?? voices.find((v) => v.lang === preferredLang) ?? null;
    utterance.lang = preferredLang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeakingIndex(index);
    utterance.onend = () => setSpeakingIndex(null);

    synth.speak(utterance);
  };

  return { speakingIndex, speakText };
}

// 🖱 Hook para detectar soporte hover
function useHoverDetection() {
  const [hasHover, setHasHover] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(hover: hover)");
      setHasHover(mq.matches);
    }
  }, []);
  return hasHover;
}

interface AboutItem {
  img: string;
  audio: string;
  text: string;
}

interface AboutContent {
  title: string;
  items: AboutItem[];
}

interface ContentStructure {
  about?: AboutContent;
}

export default function AboutMe() {
  const { lang, theme } = useApp();
  const { content, loading } = useContent();
  const about = (content as ContentStructure)?.about;
  const items: AboutItem[] = about?.items || [];

  const { speakingIndex, speakText } = useSpeechSynthesis(lang);
  const hasHover = useHoverDetection();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [textLiftIndex, setTextLiftIndex] = useState<number | null>(null);

  const handleTouch = (index: number) => {
    if (!hasHover) {
      setHoveredIndex(index);
      setTextLiftIndex(index);
      setTimeout(() => {
        setHoveredIndex(null);
        setTextLiftIndex(null);
      }, 1200);
    }
  };

  if (loading) return <p>Cargando contenido...</p>;
  if (!about) return <p>No hay contenido disponible.</p>;

  // 🎨 Estilos dinámicos
  const cardBg = theme === "dark" ? "bg-black text-white" : "bg-[#f5f5f5] text-black";
  const forestFilter = theme === "dark" ? "brightness(0.6)" : "brightness(1)";

  return (
    <section className="w-full overflow-x-hidden transition-all duration-500">
      {/* 🌲 Fondo general */}
      <div className="relative w-full z-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: "url('/images/forest-2.webp')", filter: forestFilter }}
        />
        <div className="relative z-10 py-16 px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col items-center">
          {/* 🔸 Título */}
          <h2
            className="text-2xl sm:text-4xl text-center mb-12 px-4 py-2 rounded-full shadow-lg cursor-pointer transition-all duration-500
                       bg-red-600/60 text-white hover:bg-[#d4af37] hover:text-black font-['Irish_Grover']"
          >
            {about.title ?? "About Me"}
          </h2>

          {/* 🔹 Contenido horizontal: imagen izquierda / texto derecha */}
          <div className="flex flex-col gap-10 w-full max-w-5xl">
            {items.map((item, i) => (
              <div
                key={i}
                onTouchStart={() => handleTouch(i)}
                className={`relative flex flex-col md:flex-row items-center md:items-center md:justify-between gap-6 p-6 rounded-xl shadow-lg border transition-all duration-500 ${cardBg} ${
                  hoveredIndex === i
                    ? "scale-[1.02] border-[#d4af37]"
                    : "hover:scale-[1.02] hover:border-[#d4af37]"
                }`}
                style={{
                  boxShadow:
                    theme === "dark"
                      ? "0px 4px 20px rgba(255, 215, 0, 0.3)"
                      : "0px 4px 20px rgba(212, 175, 55, 0.3)",
                }}
              >
                {/* 🔊 Botón de voz */}
                <div
                  aria-label="Toggle speech"
                  onClick={() => speakText(item.text, i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`absolute top-3 right-3 cursor-pointer transition-all duration-300 ${
                    speakingIndex === i || hoveredIndex === i
                      ? "text-blue-600 scale-125"
                      : "text-gray-500"
                  }`}
                >
                  <FaVolumeUp className="text-xl sm:text-2xl" />
                </div>

                {/* 🖼 Imagen circular izquierda */}
                <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-red-600 hover:border-[#d4af37] transition-all duration-500">
                    <Image
                      src={item.img}
                      alt={item.text ?? "Imagen"}
                      width={300}
                      height={300}
                      className={`object-cover w-full h-full rounded-full transition-all duration-500 ${
                        hoveredIndex === i ? "scale-110" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* 📝 Texto a la derecha con efecto hover/tap */}
                <div
                  className={`flex-1 text-center md:text-left transition-transform duration-500 ${
                    hasHover
                      ? "hover:-translate-y-2" // escritorio
                      : textLiftIndex === i
                      ? "-translate-y-2" // móvil (tap)
                      : "translate-y-0"
                  }`}
                >
                  <p
                    className="text-base sm:text-lg md:text-xl leading-relaxed transition-colors duration-500 px-2 sm:px-4"
                    style={{ fontFamily: "'Esteban', serif" }}
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
