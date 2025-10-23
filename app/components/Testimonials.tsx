"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useApp } from "./ThemeLangContext";
import { useContent } from "./ContentProvider";

// ✅ Tipos
interface Testimonial {
  name: string;
  text: string;
  image: string;
}

interface TestimonialsContent {
  title: string;
  list: Testimonial[];
}

export default function Testimonials() {
  const { theme, lang } = useApp();
  const { content } = useContent();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // 🟢 Hook interno para manejar lógica de testimonios
  const useTestimonials = () => {
    const [visibleCount, setVisibleCount] = useState(2);
    const [selected, setSelected] = useState<number | null>(null);
    const [tappedIndex, setTappedIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [hasHover, setHasHover] = useState(true);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      setHasHover(window.matchMedia("(hover: hover)").matches);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSelect = (idx: number) => {
      if (!hasHover) {
        setTappedIndex(idx);
        setTimeout(() => setTappedIndex(null), 800);
      } else {
        setSelected(selected === idx ? null : idx);
      }
    };

    return { visibleCount, setVisibleCount, selected, tappedIndex, isMobile, handleSelect };
  };

  // ✅ Llamada siempre al inicio
  const { visibleCount, setVisibleCount, selected, tappedIndex, isMobile, handleSelect } =
    useTestimonials();

  // Early return si no hay contenido
  if (!content?.testimonials) return null;
  const t = content.testimonials as TestimonialsContent;
  const testimonials = t.list ?? [];

  // Render de cada tarjeta de testimonio
  const renderCard = (testimonial: Testimonial, idx: number) => {
    const isSelected = selected === idx;
    const isTapped = tappedIndex === idx;

    return (
      <div
        key={idx}
        onClick={() => handleSelect(idx)}
        onTouchStart={() => handleSelect(idx)}
        className={`rounded-2xl p-6 flex items-start gap-6 border-2 transition-all duration-500 cursor-pointer
          ${theme === "dark" ? "bg-[#0e0e0e] text-white" : "bg-[#f5f5f5] text-black"}
          ${isSelected || isTapped
            ? "scale-[1.02] shadow-[0_0_25px_#c4af37] border-[#c4af37]"
            : "hover:scale-[1.02] hover:shadow-[0_0_25px_#c4af37] border-red-600"}
        `}
      >
        {!isMobile && (
          <div
            className={`flex-shrink-0 relative w-28 h-28 rounded-full border-[3px] overflow-hidden transition-all duration-500
              ${isSelected || isTapped
                ? "border-red-600 translate-y-[-4px]"
                : "border-[#c4af37] hover:border-red-600 hover:-translate-y-1"}
            `}
          >
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover rounded-full transition-all duration-300"
              sizes="112px"
            />
          </div>
        )}

        <div
          className={`flex flex-col transition-all duration-300
            ${isSelected || isTapped
              ? "translate-y-[-2px] shadow-md"
              : "hover:-translate-y-1 hover:shadow-md"}
          `}
        >
          <h3
            className={`font-['Irish_Grover'] text-2xl animate-blink ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
            style={{
              WebkitTextStroke: "0.5px #d4af37",
              textShadow: "0 0 4px #d4af37",
            }}
          >
            {testimonial.name}
          </h3>
          <p
            className={`mt-2 font-['Esteban'] text-justify transition-colors duration-300 ${
              theme === "dark"
                ? "text-gray-300 hover:text-gray-100"
                : "text-[#5c4c4c] hover:text-black"
            }`}
          >
            {testimonial.text}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center py-16 px-6 bg-cover bg-center transition-colors duration-500"
      style={{
        backgroundImage: "url('/images/parchment.webp')",
        backgroundBlendMode: theme === "dark" ? "multiply" : "normal",
        backgroundColor: theme === "dark" ? "rgba(0,0,0,0.4)" : "transparent",
      }}
    >
      {/* 🔴 Título */}
      <h2 className="text-4xl text-center bg-red-600/60 text-white font-['Irish_Grover'] px-6 py-3 rounded-full shadow-md hover:bg-[#c4af37] hover:text-black hover:shadow-[0_0_25px_#c4af37] transition-all duration-300">
        {t.title}
      </h2>

      {/* 🧾 Lista de testimonios */}
      <div className="flex flex-col gap-10 w-full max-w-4xl mt-10">
        {(isMobile ? testimonials.slice(0, visibleCount) : testimonials).map(renderCard)}
      </div>

      {/* 📱 Botón móvil */}
      {isMobile && testimonials.length > 2 && (
        <div className="mt-10 flex justify-center">
          {visibleCount >= testimonials.length ? (
            <button
              onClick={() => {
                setVisibleCount(2);
                sectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-6 py-3 rounded-full border-2 font-['Esteban'] transition-all duration-300 ${
                theme === "dark"
                  ? "border-[#c4af37] bg-[#111] text-white hover:bg-[#c4af37] hover:text-black"
                  : "border-red-600 bg-white text-black hover:bg-[#c4af37] hover:text-black"
              }`}
            >
              {lang === "es" ? "Ver menos" : "See less"}
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount((prev) => prev + 2)}
              className={`px-6 py-3 rounded-full border-2 font-['Esteban'] transition-all duration-300 ${
                theme === "dark"
                  ? "border-[#c4af37] bg-[#111] text-white hover:bg-[#c4af37] hover:text-black"
                  : "border-red-600 bg-white text-black hover:bg-[#c4af37] hover:text-black"
              }`}
            >
              {lang === "es" ? "Ver más" : "See more"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
