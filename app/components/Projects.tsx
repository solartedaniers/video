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
    className={`relative rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] mx-2 ${
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
    <div className="p-6 flex flex-col items-center gap-4">
      {/* Imagen */}
      <div className="relative w-full flex justify-center">
        <div
          className="rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(196,175,55,0.45)]"
          style={{ width: "220px", height: "140px", border: "3px solid rgba(220,20,60,0.15)" }}
        >
          <Image
            src={project.image}
            alt={project.title}
            width={220}
            height={140}
            className="object-cover w-[220px] h-[140px] transition-all duration-300"
          />
        </div>
      </div>

      {/* GitHub */}
      <div className="w-full flex justify-center px-2">
        <a
          href={project.gitUrl}
          target="_blank"
          rel="noreferrer"
          onClick={playUrlSound}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full shadow-sm border-2 transition-all duration-300 active:scale-95 ${
            theme === "dark"
              ? "bg-[#111] border-[#c4af37] hover:shadow-[0_0_18px_#c4af37]"
              : "bg-white border-red-600 hover:border-[#c4af37] hover:shadow-[0_6px_20px_rgba(196,175,55,0.45)]"
          }`}
          aria-label="GitHub Repository"
          title="GitHub Repository"
        >
          <FiGithub className={theme === "dark" ? "text-white" : "text-[#222]"} size={20} />
        </a>
      </div>

      {/* Título */}
      <h3
        className="mt-1 text-center text-xl font-medium animate-pulse"
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
        className={`text-sm text-center px-2 transition-colors duration-300 ${
          theme === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-700 hover:text-gray-900"
        }`}
        style={{ fontFamily: "'Esteban', serif" }}
      >
        {project.description}
      </p>

      {/* Herramientas */}
      <div className="w-full mt-3">
        <span
          style={{
            fontFamily: "'Irish Grover', cursive",
            fontSize: "1.4rem",
            color: theme === "dark" ? "#fff" : "#111",
            WebkitTextStroke: "0.6px #c4af37",
          }}
        >
          {lang === "es" ? "Lenguajes y herramientas" : "Languages and Tools"}
        </span>
        <div className="mt-2 flex flex-wrap gap-3 justify-start">
          {project.tools.map((tool) => (
            <button
              key={tool}
              onClick={playThunderSound}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
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
      className="relative w-full min-h-screen overflow-hidden flex items-start justify-center py-12"
      style={{
        backgroundImage: "url('/images/samuray-car.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <span className="absolute inset-0 bg-black/30 z-0" />
      <div className="relative z-10 w-[95%] max-w-6xl">
        {/* Título principal */}
        <header className="w-full flex justify-center mb-8">
          <h2 className="text-4xl text-center px-6 py-3 rounded-full shadow-md transition-all duration-300 bg-red-600/60 text-white font-['Irish_Grover'] hover:bg-[#c4af37] hover:text-black hover:shadow-[0_0_25px_#c4af37]">
            {lang === "es" ? "Mis proyectos" : "My Projects"}
          </h2>
        </header>

        {/* Swiper móvil */}
        <div className="sm:hidden w-full">
          <Swiper modules={[Navigation]} navigation spaceBetween={20} slidesPerView={1} loop>
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
        <main className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-8">
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
