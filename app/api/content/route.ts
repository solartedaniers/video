import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// 📖 GET /api/content?lang=es|en
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "es"; // idioma por defecto

    const filePath = path.join(DATA_DIR, `content_${lang}.json`);
    const data = await fs.readFile(filePath, "utf-8");

    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("❌ Error al leer archivo de idioma:", error);
    return NextResponse.json({ error: "No se pudo leer el contenido." }, { status: 500 });
  }
}

// 💾 POST /api/content?lang=es|en
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "es"; // idioma por defecto

    const filePath = path.join(DATA_DIR, `content_${lang}.json`);
    const body = await req.json();

    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al guardar archivo de idioma:", error);
    return NextResponse.json({ error: "No se pudo guardar el contenido." }, { status: 500 });
  }
}
