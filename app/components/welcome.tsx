"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { useApp } from "./ThemeLangContext";
import { useContent } from "./ContentProvider";

// 🌟 Hooks personalizados
function useRotation3D() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const container = containerRef.current;
    if (!container) return;
    const { width, height, left, top } = container.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setRotation({ x: y * 20, y: x * 20 });
  };

  const onMouseLeave = () => setRotation({ x: 0, y: 0 });

  return { rotation, containerRef, onMouseMove, onMouseLeave };
}

function useSpeechSynthesis(textArray: string[], lang: string) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const toggleSpeech = () => {
    const text = textArray.join(" ");
    const synth = window.speechSynthesis;
    if (!text) return;

    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

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
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
    setIsSpeaking(true);
  };

  return { isSpeaking, toggleSpeech };
}

// 🌟 Componente principal
interface WelcomeLang {
  home: string;
  subtitle: string;
  welcomeTitle: string;
  description: string[];
}

interface WelcomeData {
  welcome: WelcomeLang;
}

export default function Welcome() {
  const router = useRouter();
  const { lang, theme } = useApp();
  const { content, loading } = useContent();
  const t = (content as WelcomeData | null)?.welcome;

  const { rotation, containerRef, onMouseMove, onMouseLeave } = useRotation3D();
  const { isSpeaking, toggleSpeech } = useSpeechSynthesis(t?.description ?? [], lang);

  const [hovered, setHovered] = useState(false);

  const playSwordSound = () => new Audio("/sounds/sword.mp3").play().catch(() => {});
  const handleHomeClick = () => {
    playSwordSound();
    router.push("/");
  };

  if (loading || !t) return <p>Cargando contenido...</p>;

  // 🎨 Colores dinámicos
  const bgBox =
    theme === "dark" ? "bg-black text-white" : "bg-[#f5f5f5] text-[#5c4c4c]";
  const bgWhiteBox =
    theme === "dark" ? "bg-black/70 text-white" : "bg-white/60 text-black";
  const hrColor = theme === "dark" ? "border-white" : "border-black";

  return (
    <section
      className="relative min-h-screen grid grid-rows-[auto_auto_auto_auto_auto] justify-items-center gap-6 px-4 py-6 sm:px-6 sm:py-10 transition-all duration-700 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/temple.webp')", filter: "brightness(1)" }}
    >
      {/* 🏠 Botón Home */}
      <div
        aria-label="Home"
        className={`absolute top-2 left-2 flex items-center gap-1 px-1 py-0.5 rounded-lg shadow-md border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_4px_15px_rgba(218,165,32,0.6)] ${bgBox}`}
        onClick={handleHomeClick}
      >
        <div className="w-8 h-8 rounded-md overflow-hidden border-2 border-transparent transition-all duration-300">
          <Image
            src="/images/fire.webp"
            alt={t.home}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        </div>
        <span className="font-['Irish_Grover'] text-sm drop-shadow-[0_0_1px_silver] transition-all duration-300">
          {t.home}
        </span>
      </div>

      {/* 🧑 Imagen perfil */}
      <div
        ref={containerRef}
        className="relative perspective-[1000px]"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, transition: "transform 0.1s ease-out" }}
      >
        <div
          className={`rounded-full border-4 overflow-hidden w-48 h-48 sm:w-64 sm:h-64 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ${hovered ? "scale-110 border-red-600" : "border-yellow-500"}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={() => setHovered(true)}
          onTouchEnd={() => setTimeout(() => setHovered(false), 400)}
        >
          <Image
            src="/images/profile.webp"
            alt="Perfil"
            width={256}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 👤 Nombre */}
      <h1 className={`font-['Irish_Grover'] text-2xl sm:text-3xl drop-shadow-[0_0_2px_gold] hover:scale-110 hover:drop-shadow-[0_0_5px_red] transition-all duration-300 text-center cursor-pointer ${theme === "dark" ? "text-white" : "text-black"}`}>
        Daniers Alexander Solarte Limas
      </h1>

      <hr className={`w-1/2 border-t-2 transition-colors duration-500 ${hrColor}`} />

      {/* 🏷️ Subtítulo */}
      <h2 className={`font-['Esteban'] text-xl sm:text-2xl font-bold drop-shadow-[0_0_1px_gray] px-1 py-1 rounded-xl text-center cursor-pointer transition-all duration-500 ${bgWhiteBox} animate-pulse`}>
        {t.subtitle}
      </h2>

      {/* 👋 Bienvenida */}
      <h3 className={`font-['Irish_Grover'] text-2xl sm:text-4xl text-white ${theme === "dark" ? "bg-red-800/80" : "bg-red-600/70"} px-6 sm:px-10 py-3 rounded-full shadow-md hover:bg-[#d4af37] hover:text-black transition-all duration-300 text-center`}>
        {t.welcomeTitle}
      </h3>

      {/* 📜 Descripción + narrador */}
      <div className={`p-4 sm:p-6 rounded-2xl shadow-md border w-full max-w-2xl relative hover:border-yellow-500 hover:shadow-lg hover:scale-105 transition-all duration-500 ${bgBox}`}>
        <div
          aria-label="Toggle speech"
          className={`absolute top-2 right-2 transition-all duration-300 cursor-pointer ${isSpeaking ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
          onClick={toggleSpeech}
        >
          <FaVolumeUp className="text-xl hover:scale-125 transition-transform duration-300" />
        </div>

        {t.description.map((text, i) => (
          <p
            key={i}
            className={`mt-${i === 0 ? "0" : "4"} font-['Esteban'] text-base sm:text-lg leading-relaxed text-center`}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </div>
    </section>
  );
}
