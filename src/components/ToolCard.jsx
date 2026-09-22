import React from "react";
import { Link } from "react-router-dom";
import {
  FaBalanceScale,
  FaCalculator,
  FaNewspaper,
  FaUniversity,
  FaGavel,
  FaBell,
  FaClipboardList,
  FaCreditCard,
} from "react-icons/fa";
import { isInternalPath } from "../constants/site";

const toolIcons = {
  "Derecho fijo": FaBalanceScale,
  Liquidaciones: FaCalculator,
  Edictos: FaNewspaper,
  "Caja forense": FaUniversity,
  "Poder Judicial Mza": FaGavel,
  Notificaciones: FaBell,
  "Listas diarias": FaClipboardList,
  ATM: FaCreditCard,
};

const ToolCard = ({
  title = "Herramientas Digitales",
  tools = [],
  variant = "dark",
}) => {
  const isLight = variant === "light";

  return (
    <div
      className={`text-center relative w-full ${
        isLight ? "text-primary p-2 md:p-4" : "text-white p-1 md:p-2"
      }`}
    >
      <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-2 text-secondary">
        Trámites y servicios
      </span>
      <h2
        className={`font-serif text-3xl md:text-4xl font-semibold mb-2 tracking-tight ${
          isLight ? "text-primary" : "text-white"
        }`}
      >
        {title}
      </h2>
      <div className="w-16 h-1 bg-secondary mx-auto mb-3"></div>
      <p
        className={`max-w-2xl mx-auto mb-8 font-lato text-sm md:text-base leading-relaxed ${
          isLight ? "text-gray-600" : "text-white/75"
        }`}
      >
        Accedé a las herramientas y links claves de la Segunda Circunscripción
        de forma rápida y sencilla.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto text-left">
        {tools.map((tool, index) => {
          const IconComponent = toolIcons[tool.name];
          const className = `group rounded-xl px-5 h-14 w-full flex items-center gap-3 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
            isLight
              ? "bg-slate-50 text-primary border border-slate-200 hover:bg-white hover:border-secondary/30"
              : "bg-white text-primary hover:bg-secondary hover:text-white"
          }`;

          const content = (
            <>
              {IconComponent ? (
                <IconComponent
                  className={`text-lg flex-shrink-0 ${
                    isLight
                      ? "text-primary"
                      : "text-primary group-hover:text-white"
                  }`}
                />
              ) : (
                <span className="text-xl">🔗</span>
              )}
              <span className="font-semibold text-sm tracking-wide">
                {tool.name}
              </span>
            </>
          );

          if (isInternalPath(tool.link)) {
            return (
              <Link key={`${tool.name}-${index}`} to={tool.link} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <a
              key={`${tool.name}-${index}`}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ToolCard;
