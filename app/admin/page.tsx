"use client";
import { useEffect, useState } from "react";
import { useContent } from "../components/ContentProvider";
import { useApp } from "../components/ThemeLangContext";

export default function AdminPage() {
  const { content, loading, saveContent } = useContent();
  const { lang, setLang } = useApp();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (content) setText(JSON.stringify(content, null, 2));
  }, [content]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(text);
      const ok = await saveContent(parsed);
      setMsg(ok ? "✅ Guardado con éxito" : "❌ Error al guardar");
    } catch {
      setMsg("⚠️ Error: JSON inválido");
    }
    setTimeout(() => setMsg(""), 3000);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4 font-bold">📝 Editor de contenido ({lang.toUpperCase()})</h1>

      {/* 🌍 Selector de idioma */}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as "es" | "en")}
        className="mb-4 border px-3 py-2 rounded"
      >
        <option value="es">Español</option>
        <option value="en">Inglés</option>
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        className="w-full border rounded p-2 font-mono"
      />
      <div className="flex gap-3 mt-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
