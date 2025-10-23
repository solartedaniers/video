"use client";
import { useApp } from "../components/ThemeLangContext";
import Navbar from "../components/Navbar";
import Welcome from "../components/welcome";
import AboutMe from "../components/AboutMe";
import Lenguajes from "../components/languages";
import Projects from "../components/Projects";
import Testimonials from "../components/Testimonials";
import CvSection from "../components/CvSection";
import Experiencia from "../components/experience";
import Filosofia from "../components/philosophy";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

// 🌟 Lista de secciones para mapear
const sections = [
  { id: "bienvenidos", component: <Welcome /> },
  { id: "acercademi", component: <AboutMe /> },
  { id: "tecnologias", component: <Lenguajes /> },
  { id: "misproyectos", component: <Projects /> },
  { id: "testimonios", component: <Testimonials /> },
  { id: "cv", component: <CvSection /> },
  { id: "experiencia", component: <Experiencia /> },
  { id: "filosofia", component: <Filosofia /> },
  { id: "contacto", component: <Contact /> },
  { id: "PieDePágina", component: <Footer /> },
];

export default function PortfolioPage() {
  const { theme } = useApp();

  return (
    <main
      className={`min-h-screen flex flex-col gap-10 scroll-smooth px-4 py-6 pt-24 
        ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {/* ✅ Barra de navegación fija */}
      <Navbar />

      {/* ✅ Secciones */}
      {sections.map(({ id, component }) => (
        <section
          key={id}
          id={id}
          className="scroll-mt-24 border-[15px] border-[#d4af37] p-4 box-border"
        >
          {component}
        </section>
      ))}
    </main>
  );
}
