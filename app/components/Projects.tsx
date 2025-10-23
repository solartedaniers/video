"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { FiGithub } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useApp } from "./ThemeLangContext";
import { useContent } from "./ContentProvider";

// 🌟 Tipos
type Project = {
  image: string;
  title: string;
  description: string;
  tools: string[];
  gitUrl: string;
};

interface ProjectCardProps {
  project: Project;
  theme: string;
  lang: string;
  playUrlSound: () => void;
  playThunderSound: () => void;
}

// 🌟 Componente separado para cada tarjeta
const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  theme,
  lang,
  playUrlSound,
  playThunderSound,
}) => (
  <article
    className={`relative rounded-lg xs:rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] mx-1 xs:mx-2 ${
      theme === "dark" ? "bg-[#0e0e0e] text-white" : "bg-[#f5f5f5] text-black"
    }`}
    style={{
      border: "2px solid red",
      boxShadow:
        theme === "dark"
          ? "0 10px 30px rgba(255,255,255,0.08), 0 0 18px rgba(196,175,55,0.2)"
          : "0 10px 30px rgba(0,0,0,0.12), 0 0 18px rgba(196,175,55,0.14)",
    }}
  >
    <div className="p-3 xs:p-4 sm:p-6 flex flex-col items-center gap-2 xs:gap-3 sm:gap-4">
      {/* Imagen */}
      <div className="relative w-full flex justify-center">
        <div
          className="rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(196,175,55,0.45)] w-[180px] h-[120px] xs:w-[200px] xs:h-[130px] sm:w-[220px] sm:h-[140px]"
          style={{ 
            border: "2px solid rgba(220,20,60,0.15)" 
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            width={220}
            height={140}
            className="object-cover w-full h-full transition-all duration-300"
          />
        </div>
      </div>

      {/* GitHub */}
      <div className="w-full flex justify-center px-1 xs:px-2">
        <a
          href={project.gitUrl}
          target="_blank"
          rel="noreferrer"
          onClick={playUrlSound}
          className={`inline-flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full shadow-sm border-2 transition-all duration-300 active:scale-95 ${
            theme === "dark"
              ? "bg-[#111] border-[#c4af37] hover:shadow-[0_0_18px_#c4af37]"
              : "bg-white border-red-600 hover:border-[#c4af37] hover:shadow-[0_6px_20px_rgba(196,175,55,0.45)]"
          }`}
          aria-label="GitHub Repository"
          title="GitHub Repository"
        >
          <FiGithub className={theme === "dark" ? "text-white" : "text-[#222]"} size={16} />
        </a>
      </div>

      {/* Título */}
      <h3
        className="mt-1 text-center text-lg xs:text-xl sm:text-2xl font-medium animate-pulse"
        style={{
          fontFamily: "'Esteban', serif",
          color: theme === "dark" ? "#f5f5f5" : "#a0a0a0",
          WebkitTextStroke: theme === "dark" ? "0.6px rgba(255,255,255,0.25)" : "0.6px rgba(0,0,0,0.45)",
          textShadow: theme === "dark" ? "0 2px 6px rgba(255,255,255,0.15)" : "0 2px 6px rgba(0,0,0,0.35)",
        }}
      >
        {project.title}
      </h3>

      {/* Descripción */}
      <p
        className={`text-xs xs:text-sm sm:text-base text-center px-1 xs:px-2 transition-colors duration-300 ${
          theme === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-700 hover:text-gray-900"
        }`}
        style={{ fontFamily: "'Esteban', serif" }}
      >
        {project.description}
      </p>

      {/* Herramientas */}
      <div className="w-full mt-2 xs:mt-3">
        <span
          className="text-sm xs:text-base sm:text-lg"
          style={{
            fontFamily: "'Irish Grover', cursive",
            color: theme === "dark" ? "#fff" : "#111",
            WebkitTextStroke: "0.6px #c4af37",
          }}
        >
          {lang === "es" ? "Lenguajes y herramientas" : "Languages and Tools"}
        </span>
        <div className="mt-1 xs:mt-2 flex flex-wrap gap-1 xs:gap-2 sm:gap-3 justify-center xs:justify-start">
          {project.tools.map((tool) => (
            <button
              key={tool}
              onClick={playThunderSound}
              className={`px-2 xs:px-3 py-1 rounded-full text-xs xs:text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                theme === "dark" ? "bg-[#111] text-white" : "bg-white text-[#111]"
              }`}
              style={{
                fontFamily: "'Esteban', serif",
                border: "1px solid #c4af37",
                boxShadow: theme === "dark" ? "0 6px 18px rgba(255,255,255,0.06)" : "0 6px 18px rgba(0,0,0,0.06)",
              }}
            >
              <span style={{ WebkitTextStroke: "0.6px #c4af37" }}>{tool}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </article>
);

export default function Projects() {
  const { theme, lang } = useApp();
  const { content } = useContent();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const thunderRef = useRef<HTMLAudioElement | null>(null);

  const projects = (content as { projects?: Project[] } | null)?.projects ?? [];

  const playUrlSound = () => {
    if (audioRef.current) {
      audioRef.current.src = "/sounds/url.mp3";
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const playThunderSound = () => {
    if (thunderRef.current) {
      thunderRef.current.src = "/sounds/thunder.mp3";
      thunderRef.current.currentTime = 0;
      thunderRef.current.play().catch(() => {});
    }
  };

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex items-start justify-center py-6 xs:py-8 sm:py-10 md:py-12"
      style={{
        backgroundImage: "url('/images/samuray-car.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <span className="absolute inset-0 bg-black/30 z-0" />
      <div className="relative z-10 w-[95%] xs:w-[90%] sm:w-[85%] max-w-7xl">
        {/* Título principal */}
        <header className="w-full flex justify-center mb-4 xs:mb-6 sm:mb-8">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center px-3 xs:px-4 sm:px-6 md:px-8 py-2 xs:py-3 sm:py-4 rounded-full shadow-md transition-all duration-300 bg-red-600/60 text-white font-['Irish_Grover'] hover:bg-[#c4af37] hover:text-black hover:shadow-[0_0_25px_#c4af37]">
            {lang === "es" ? "Mis proyectos" : "My Projects"}
          </h2>
        </header>

        {/* Swiper móvil */}
        <div className="md:hidden w-full">
          <Swiper modules={[Navigation]} navigation spaceBetween={10} slidesPerView={1} loop>
            {projects.map((p, i) => (
              <SwiperSlide key={i}>
                <ProjectCard
                  project={p}
                  theme={theme}
                  lang={lang}
                  playUrlSound={playUrlSound}
                  playThunderSound={playThunderSound}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Rejilla escritorio */}
        <main className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
          {projects.map((p, i) => (
            <ProjectCard
              key={i}
              project={p}
              theme={theme}
              lang={lang}
              playUrlSound={playUrlSound}
              playThunderSound={playThunderSound}
            />
          ))}
        </main>
      </div>

      {/* Audios */}
      <audio ref={audioRef} preload="auto" />
      <audio ref={thunderRef} preload="auto" />
    </section>
  );
}
