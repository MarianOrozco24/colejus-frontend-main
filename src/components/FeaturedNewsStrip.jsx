import React from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";
import { mapNewsItemForCard } from "../utils/newsDisplay";

const FeaturedNewsStrip = ({ items = [], variant = "default" }) => {
  const stripItems = items.map((item, index) => mapNewsItemForCard(item, index));

  if (stripItems.length === 0) return null;

  const isCompact = variant === "home";

  return (
    <div className={isCompact ? "mb-12" : "mb-16"}>
      <div className={isCompact ? "max-w-5xl mx-auto" : ""}>
        <h3
          className={`font-serif font-semibold text-primary tracking-tight ${
            isCompact ? "text-2xl mb-6 text-center" : "text-3xl mb-8"
          }`}
        >
          Destacadas
        </h3>

        <div
          className={`flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory ${
            isCompact ? "" : "-mx-1 px-1"
          }`}
        >
          {stripItems.map((item) => (
            <Link
              key={item.uuid}
              to={item.link}
              className={`group shrink-0 snap-start flex flex-col overflow-hidden rounded-2xl bg-white border-2 border-secondary/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                isCompact ? "w-[260px] sm:w-[280px]" : "w-[280px] sm:w-[300px] md:w-[320px]"
              }`}
            >
              <div
                className={`relative overflow-hidden bg-slate-200 ${
                  isCompact ? "h-36" : "h-40 sm:h-44"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06092E]/50 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">
                  Destacada
                </span>
              </div>

              <div className="flex flex-col flex-1 p-4 sm:p-5">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-3 mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-sm text-gray-600 font-lato line-clamp-2 leading-relaxed mb-3">
                    {item.subtitle}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <div className="flex flex-col gap-0.5 text-gray-400 text-[11px] font-semibold">
                    {item.dateLabel && (
                      <span className="flex items-center gap-1">
                        <FaRegCalendarAlt className="text-xs" />
                        {item.dateLabel}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FaRegClock className="text-xs" />
                      {item.reading_duration}m
                    </span>
                  </div>
                  <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors whitespace-nowrap">
                    Leer →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedNewsStrip;
