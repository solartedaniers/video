"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaLinkedin, FaWhatsapp, FaUser, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { useApp } from "./ThemeLangContext";
import { useContent } from "./ContentProvider";

type ContactContent = {
  background: string;
  title: string;
  message: string;
  profile: { default: string; hover: string };
  social: {
    linkedin: { url: string; label: string };
    whatsapp: { url: string; label: string };
  };
  fields: {
    email: { label: string; placeholder: string };
    name: { label: string; placeholder: string };
    content: { label: string; placeholder: string };
    send: string;
  };
  errors: {
    email: string;
    nombre: string;
    contenido: string;
    onlyLetters: string;
  };
  success: string;
  error: string;
};

export default function Contact() {
  const { theme } = useApp();
  const { content } = useContent();

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [contenido, setContenido] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [hasHover, setHasHover] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasHover(window.matchMedia("(hover: hover)").matches);
    }
  }, []);

  if (!content?.contact) return null;
  const c = content.contact as ContactContent;

  const playLinkedInSound = () => new Audio("/sounds/LinkedIn.mp3").play();
  const playWhatsAppSound = () => new Audio("/sounds/whatsapp.mp3").play();
  const playSendSound = () => new Audio("/sounds/blow.mp3").play();

  const boxBg = theme === "dark" ? "bg-[#111111]" : "bg-[#f5f5f5]";
  const textMain = theme === "dark" ? "text-[#e6e6e6]" : "text-[#5c4c4c]";
  const inputText = theme === "dark" ? "text-white" : "text-black";
  const placeholderColor = theme === "dark" ? "placeholder-gray-400" : "placeholder-gray-500";

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[\w._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;

    if (!email) newErrors.email = c.errors.email;
    else if (!emailRegex.test(email)) newErrors.email = c.errors.email;

    if (!nombre) newErrors.nombre = c.errors.nombre;
    else if (!nameRegex.test(nombre)) {
      newErrors.nombre = /\d/.test(nombre) ? c.errors.onlyLetters : c.errors.nombre;
    }

    if (!contenido.trim()) newErrors.contenido = c.errors.contenido;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    if (validateForm()) {
      playSendSound();
      try {
        const res = await fetch("https://formsubmit.co/ajax/solartedaniers@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, nombre, contenido }),
        });

        if (res.ok) {
          setSuccessMsg(c.success);
          setEmail("");
          setNombre("");
          setContenido("");
        } else {
          setSuccessMsg(c.error);
        }
      } catch {
        setSuccessMsg(c.error);
      }

      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleHoverToggle = () => {
    if (!hasHover) {
      setHovered((prev) => !prev);
      setTimeout(() => setHovered(false), 1200);
    }
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-3 xs:p-4 sm:p-6 transition-all duration-500"
      style={{ backgroundImage: `url(${c.background})` }}
    >
      {/* 🔴 Título principal */}
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center px-3 xs:px-4 sm:px-6 md:px-8 py-2 xs:py-3 sm:py-4 rounded-full shadow-lg transition-all duration-500 bg-red-600/80 text-white font-['Irish_Grover'] hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_25px_#d4af37] mb-3 xs:mb-4 sm:mb-6">
        {c.title}
      </h2>

      {/* 💬 Mensaje - visible en mobile debajo del título */}
      <div className="block lg:hidden w-full max-w-sm xs:max-w-md mb-4 xs:mb-6 sm:mb-8">
        <div
          className={`${boxBg} p-3 xs:p-4 rounded-lg xs:rounded-xl shadow-md border hover:border-red-600 transition-all duration-300`}
        >
          <p
            className={`font-['Esteban'] ${textMain} text-sm xs:text-base leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: c.message }}
          />
        </div>
      </div>

      {/* 💬 Mensaje - visible solo en escritorio */}
      <div className="hidden lg:block">
        <div
          className={`${boxBg} p-4 xs:p-6 rounded-xl shadow-md border hover:border-red-600 hover:shadow-[#d4af37] transition-all duration-300 hover:scale-105 max-w-lg xl:max-w-xl w-full mb-8 xl:mb-12`}
        >
          <p
            className={`font-['Esteban'] ${textMain} text-base xs:text-lg leading-relaxed`}
            dangerouslySetInnerHTML={{ __html: c.message }}
          />
        </div>
      </div>

      {/* 🟨 Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 lg:gap-12 w-full max-w-7xl items-center">
        {/* 👤 Imagen */}
        <div className="hidden lg:flex justify-center items-start mt-3 xs:mt-4 sm:mt-5">
          <div
            className={`rounded-full border-3 xs:border-4 border-yellow-500 overflow-hidden w-64 xs:w-72 sm:w-80 h-64 xs:h-72 sm:h-80 transition-all duration-300 cursor-pointer ${
              hovered ? "shadow-[0_0_30px_10px_gold] scale-110" : "shadow-lg"
            }`}
            onMouseEnter={() => hasHover && setHovered(true)}
            onMouseLeave={() => hasHover && setHovered(false)}
            onTouchStart={handleHoverToggle}
          >
            <Image
              src={hovered ? c.profile.hover : c.profile.default}
              alt="Perfil"
              width={384}
              height={384}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 📨 Formulario y redes */}
        <div className="flex flex-col items-center justify-center text-center gap-4 xs:gap-6 sm:gap-8 w-full">
          {/* 🌐 Redes sociales (LinkedIn y WhatsApp en fila en móvil) */}
          <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 w-full max-w-sm xs:max-w-md">
            {/* 🔹 LinkedIn */}
            <a
              href={c.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playLinkedInSound}
              className={`${boxBg} flex items-center justify-center gap-1 xs:gap-2 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border shadow-md hover:border-yellow-500 hover:scale-105 transition-all duration-300 w-[48%] xs:w-[45%] sm:w-auto`}
            >
              <FaLinkedin className="text-lg xs:text-xl sm:text-2xl text-blue-600" />
              <span className={`font-['Esteban'] ${textMain} text-xs xs:text-sm sm:text-base`}>{c.social.linkedin.label}</span>
            </a>

            {/* 🟢 WhatsApp */}
            <a
              href={c.social.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playWhatsAppSound}
              className={`${boxBg} flex items-center justify-center gap-1 xs:gap-2 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border shadow-md hover:border-yellow-500 hover:scale-105 transition-all duration-300 w-[48%] xs:w-[45%] sm:w-auto`}
            >
              <FaWhatsapp className="text-lg xs:text-xl sm:text-2xl text-green-600" />
              <span className={`font-['Esteban'] ${textMain} text-xs xs:text-sm sm:text-base`}>{c.social.whatsapp.label}</span>
            </a>
          </div>

          {/* ✉️ Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 xs:gap-4 w-full max-w-sm xs:max-w-md text-left">
            {/* 📧 Email */}
            <label className="font-['Esteban'] text-sm xs:text-base sm:text-lg text-slate-200">{c.fields.email.label}</label>
            <div className={`${boxBg} flex items-center gap-2 p-2 xs:p-3 rounded-lg xs:rounded-xl border-2 border-red-600`}>
              <FaEnvelope className="text-gray-500 text-sm xs:text-base" />
              <input
                type="email"
                placeholder={c.fields.email.placeholder}
                className={`bg-transparent w-full outline-none font-['Esteban'] text-sm xs:text-base ${placeholderColor} ${inputText}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="bg-gray-200 text-black text-xs xs:text-sm px-2 xs:px-3 py-1 rounded-md">{errors.email}</p>}

            {/* 👤 Nombre */}
            <label className="font-['Esteban'] text-sm xs:text-base sm:text-lg text-slate-200">{c.fields.name.label}</label>
            <div className={`${boxBg} flex items-center gap-2 p-2 xs:p-3 rounded-lg xs:rounded-xl border-2 border-red-600`}>
              <FaUser className="text-gray-500 text-sm xs:text-base" />
              <input
                type="text"
                placeholder={c.fields.name.placeholder}
                className={`bg-transparent w-full outline-none font-['Esteban'] text-sm xs:text-base ${placeholderColor} ${inputText}`}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            {errors.nombre && <p className="bg-gray-200 text-black text-xs xs:text-sm px-2 xs:px-3 py-1 rounded-md">{errors.nombre}</p>}

            {/* 📝 Contenido */}
            <label className="font-['Esteban'] text-sm xs:text-base sm:text-lg text-slate-200">{c.fields.content.label}</label>
            <textarea
              placeholder={c.fields.content.placeholder}
              className={`${boxBg} p-2 xs:p-3 rounded-lg xs:rounded-xl border-2 border-red-600 w-full h-20 xs:h-24 sm:h-28 font-['Esteban'] text-sm xs:text-base ${placeholderColor} ${inputText}`}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
            />
            {errors.contenido && (
              <p className="bg-gray-200 text-black text-xs xs:text-sm px-2 xs:px-3 py-1 rounded-md">{errors.contenido}</p>
            )}

            {/* 🚀 Botón enviar */}
            <button
              type="submit"
              className={`${boxBg} flex items-center justify-center gap-2 px-4 xs:px-6 py-2 xs:py-3 rounded-full border-2 border-red-600 hover:border-yellow-500 hover:shadow-lg hover:scale-105 transition-all duration-300`}
            >
              <FaPaperPlane className={`${inputText} animate-pulse text-sm xs:text-base`} />
              <span className={`font-['Esteban'] text-sm xs:text-base ${inputText}`}>{c.fields.send}</span>
            </button>

            {successMsg && (
              <p className="text-black text-sm xs:text-base bg-gray-200 mt-2 xs:mt-3 py-2 px-2 xs:px-3 rounded-md shadow-md animate-fadeIn">
                {successMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
