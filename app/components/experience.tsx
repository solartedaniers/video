"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaVolumeUp, FaBriefcase } from "react-icons/fa";
import { useContent } from "./ContentProvider";
import { useApp } from "./ThemeLangContext";

interface ExperienciaData {
  title: string;
  academic: string;
  academicText: string;
  academicProjects: string;
  academicList: string[];
  work: string;
  workText: string;
  workList: string[];
}

export default function Experiencia() {
  const { content, loading } = useContent();
  const { lang, theme } = useApp();

  const [speaking, setSpeaking] = useState<"academico" | "laboral" | null>(null);
  const [hovered, setHovered] = useState<"academico" | "laboral" | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  if (loading) return <p className="text-center text-white">Cargando...</p>;

  const experiencia = content?.experiencia as ExperienciaData | undefined;
  if (!experiencia) return null;

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#1e1e1e]" : "bg-[#f5f5f5]";
  const textColor = isDark ? "text-[#eaeaea]" : "text-[#5c4c4c]";

  const speakText = (text: string, type: "academico" | "laboral") => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const preferredLang = lang === "es" ? "es-ES" : "en-US";

    const maleVoice = voices.find(
      (v) =>
        v.lang === preferredLang &&
        /male|man|david|jorge|diego|miguel|pablo|john|mike/i.test(v.name)
    );
    const fallbackVoice = voices.find((v) => v.lang === preferredLang);

    utterance.voice = maleVoice ?? fallbackVoice ?? null;
    utterance.lang = preferredLang;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(type);
    utterance.onend = () => setSpeaking(null);

    synth.speak(utterance);
  };

  const handleTouchHover = (type: "academico" | "laboral") => {
    if (isTouchDevice) {
      setHovered(type);
      setTimeout(() => setHovered(null), 800);
    }
  };

  const renderCard = (
    icon: React.ReactNode,
    title: string,
    text: string,
    list: string[],
    type: "academico" | "laboral",
    projectsTitle?: string
  ) => {
    const isHovered = hovered === type;
    const isSpeaking = speaking === type;

    return (
      <div
        key={type}
        onTouchStart={() => handleTouchHover(type)}
        className={`w-full max-w-2xl ${cardBg} shadow-lg p-6 rounded-xl transition-all duration-300 border-2 ${
          isDark ? "border-[#c4af37]/40" : "border-transparent"
        } ${isHovered ? "shadow-[0_0_25px_#c4af37] scale-105" : "hover:shadow-[0_0_25px_#c4af37] hover:scale-105"}`}
      >
        <div className="flex items-center justify-between mb-4">
          {icon}

          {/* Títulos internos de cards se mantienen igual */}
          <h3
            className={`text-xl font-['Irish_Grover'] mx-4 flex-1 text-center hover:text-[#c4af37] hover:scale-105 transition-all duration-300`}
            style={{ WebkitTextStroke: "0.8px #c4af37" }}
          >
            {title}
          </h3>

          <button
            onClick={() => speakText(text, type)}
            onMouseEnter={() => setHovered(type)}
            onMouseLeave={() => setHovered(null)}
            onTouchStart={() => handleTouchHover(type)}
            className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md ${
              isSpeaking || isHovered ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <FaVolumeUp />
          </button>
        </div>

        <p className={`font-['Esteban'] ${textColor} mb-3`}>{text}</p>

        {projectsTitle && <p className="font-['Esteban'] text-[#c4af37] font-bold mb-2">{projectsTitle}</p>}

        <ul className={`list-disc pl-6 font-['Esteban'] ${textColor} space-y-1`}>
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: "url('/images/city.webp')" }}
    >
      {/* 🔴 Título Principal */}
      <h2
        className={`text-4xl text-center px-6 py-2 rounded-full shadow-lg font-['Irish_Grover'] transition-all duration-500
          bg-red-600 text-white hover:bg-[#c4af37] hover:text-black hover:shadow-[0_0_25px_#c4af37]`}
      >
        {experiencia.title}
      </h2>

      {/* 🟨 Grid de Experiencias */}
      <div className="grid gap-10 mt-10 w-full place-items-center">
        {renderCard(
          <Image
            src="/images/seminar.webp"
            alt="Seminario"
            width={48}
            height={48}
            className="border-2 border-red-600 rounded transition-all duration-300 hover:scale-110 hover:border-[#c4af37]"
          />,
          experiencia.academic,
          experiencia.academicText,
          experiencia.academicList,
          "academico",
          experiencia.academicProjects
        )}

        {renderCard(
          <FaBriefcase className="text-4xl text-red-600 transition-all duration-300 hover:scale-110 hover:text-[#c4af37]" />,
          experiencia.work,
          experiencia.workText,
          experiencia.workList,
          "laboral"
        )}
      </div>
    </section>
  );
}
