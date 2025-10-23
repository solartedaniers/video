"use client";
import React from "react";
import Hero from "./components/Hero";
import './globals.css';

export default function Page() {
  return (
    <main className="w-screen h-screen flex items-center justify-center overflow-hidden">
      <div className="w-full h-full border-[20px] border-[#d4af37] box-border overflow-hidden">
        <Hero />
      </div>
    </main>
  );
}
