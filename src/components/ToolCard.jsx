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
      className={`rounded-2xl p-8 md:p-12 text-center relative w-full ${
        isLight
          ? "bg-white text-primary shadow-[0_15px_40px_rgba(18,23,74,0.08)] border border-slate-200"
          : "text-white shadow-2xl border border-white/10"
      }`}
      style={
        isLight
          ? undefined
          : { background: "linear-gradient(135deg, #1A1F66 0%, #06092E 100%)" }
      }
    >
      <h2
        className={`font-serif text-3xl md:text-5xl font-semibold mb-3 tracking-tight ${
          isLight ? "text-primary" : "text-white"
        }`}
      >
        {title}
      </h2>
      <p
        className={`max-w-2xl mx-auto mb-10 font-lato text-sm md:text-base leading-relaxed ${
          isLight ? "text-gray-600" : "text-gray-300"
        }`}
      >
        Accedé a las herramientas y links claves de la Segunda Circunscripción
        de forma rápida y sencilla.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
        {tools.map((tool, index) => {
          const IconComponent = toolIcons[tool.name];
          const internal = isInternalPath(tool.link);
          const className = `rounded-xl px-5 h-16 w-full flex items-center gap-3 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-md ${
            isLight
              ? "bg-slate-50 text-primary border border-slate-200 hover:bg-white hover:border-secondary/30"
              : index < 4
                ? "bg-white text-primary hover:bg-gray-50"
                : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
          }`;
          const iconClass = `text-xl flex-shrink-0 ${
            isLight || index < 4 ? "text-primary" : "text-white"
          }`;

          const content = (
            <>
              {IconComponent ? (
                <IconComponent className={iconClass} />
              ) : (
                <span className="text-xl">🔗</span>
              )}
              <span className="font-semibold text-sm tracking-wide">
                {tool.name}
              </span>
            </>
          );

          if (internal) {
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
