import React from "react";
import ResponsiveNav from "./ResponsiveNav";

const Header = () => {
  return (
    <header className="relative overflow-hidden pt-28 pb-20 md:pt-52 md:pb-32 px-6 text-white text-center">
      <img
        src="/image-1.jpeg"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="absolute top-0 left-0 right-0 z-30">
        <ResponsiveNav />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto mt-6 flex flex-col items-center">
        <div className="bg-[#06092E]/45 backdrop-blur-[6px] py-10 px-6 md:py-12 md:px-16 rounded-3xl border border-white/10 max-w-4xl mx-auto flex flex-col items-center shadow-xl">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-tight mb-5"
            style={{ textShadow: "0 4px 10px rgba(0,0,0,0.8)" }}
          >
            Colegio Público de <br className="hidden md:inline" /> Abogados y
            Procuradores
          </h1>
          <p
            className="text-sm md:text-lg font-light text-slate-200 tracking-wider max-w-2xl leading-relaxed font-lato"
            style={{ textShadow: "0 2px 5px rgba(0,0,0,0.5)" }}
          >
            Segunda Circunscripción Judicial de Mendoza
            <span className="block text-yellow-500 font-semibold mt-3 text-[11px] md:text-xs uppercase tracking-[0.25em]">
              San Rafael • General Alvear • Malargüe
            </span>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
