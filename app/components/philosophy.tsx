"use client";
import { useState, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
import Image from "next/image";
import { useApp } from "./ThemeLangContext";
import { useContent } from "./ContentProvider";

interface FilosofiaData {
  title: string;
  text: string[];
  image: string;
  background: string;
}

export default function Filosofia() {
  const { lang, theme } = useApp();
  const { content } = useContent();

  const data = content?.filosofia as FilosofiaData | undefined;
  const [speaking, setSpeaking] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [iconHovered, setIconHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice(window.matchMedia("(hover: none)").matches);
      window.speechSynthesis?.getVoices();
    }
  }, []);

  const speakText = () => {
    if (!data || typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(data.text.join(" "));
    const voices = synth.getVoices();
    const preferredLang = lang === "es" ? "es-ES" : "en-US";

    const maleVoice =
      voices.find(
        (v) =>
          v.lang.startsWith(lang) &&
          /male|man|david|jorge|diego|pablo|john|mike|brian|daniel/i.test(v.name)
      ) ?? voices.find((v) => v.lang.startsWith(lang));

    utterance.voice = maleVoice ?? null;
    utterance.lang = preferredLang;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);

    synth.speak(utterance);
  };

  const handleTouch = () => {
    if (isTouchDevice) {
      setHovered(true);
      setTimeout(() => setHovered(false), 400);
    }
  };

  const handleIconTouch = () => {
    if (isTouchDevice) {
      setIconHovered(true);
      setTimeout(() => setIconHovered(false), 400);
    }
  };

  if (!data) return null;

  const bgColor = theme === "dark" ? "bg-[#111111]" : "bg-[#f5f5f5]";
  const textColor = theme === "dark" ? "text-[#e6e6e6]" : "text-[#5c4c4c]";

  return (
    <section
      className="relative w-full min-h-screen grid place-items-center bg-cover bg-center"
      style={{ backgroundImage: `url('${data.background}')` }}
    >
      <div className="relative max-w-3xl w-[90%] grid gap-6 mt-5">
        {/* 🔴 Título */}
        <h2 className="text-4xl text-center px-6 py-2 rounded-full shadow-lg transition-all duration-500 bg-red-600 text-white font-['Irish_Grover'] hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_25px_#d4af37]">
          {data.title}
        </h2>

        {/* 📜 Contenedor principal */}
        <div
          className={`relative ${bgColor} rounded-2xl shadow-[0_0_20px_#d4af37] p-6 md:p-10 transition-all duration-500 border-4 border-transparent ${
            hovered ? "scale-105 border-red-600 shadow-[0_0_30px_#d4af37]" : ""
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={handleTouch}
        >
          {/* 🔊 Icono de voz */}
          <button
            onClick={speakText}
            onMouseEnter={() => setIconHovered(true)}
            onMouseLeave={() => setIconHovered(false)}
            onTouchStart={handleIconTouch}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md ${
              speaking || iconHovered ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <FaVolumeUp size={24} />
          </button>

          {/* 🖼️ Imagen */}
          <div className="flex justify-center mb-6">
            <Image
              src={data.image}
              alt="Filosofía"
              width={100}
              height={100}
              className="object-cover rounded-full border-[3px] border-[#d4af37] shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-black hover:border-red-600"
            />
          </div>

          {/* 📖 Texto */}
          <div
            className={`text-[17px] leading-relaxed font-esteban ${textColor} transition-all duration-300 hover:tracking-wide text-justify`}
          >
            {data.text.map((p, i) => (
              <p key={i} className="mb-4">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
