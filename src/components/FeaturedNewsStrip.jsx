import React from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";
import { mapNewsItemForCard } from "../utils/newsDisplay";

const Meta = ({ item, light = false }) => (
  <div
    className={`flex items-center gap-3 text-[11px] font-semibold ${
      light ? "text-white/75" : "text-gray-400"
    }`}
  >
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
);

const LeadCard = ({ item }) => (
  <Link
    to={item.link}
    className="group relative isolate flex h-full min-h-[260px] overflow-hidden rounded-2xl bg-primary shadow-[0_12px_28px_rgba(18,23,74,0.14)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(18,23,74,0.2)] transition-all duration-300"
  >
    <img
      src={item.image}
      alt={item.title}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#06092E] via-[#06092E]/55 to-[#06092E]/10" />
    <span className="absolute top-4 left-4 z-10 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">
      Destacada
    </span>
    <div className="relative z-10 mt-auto p-5 md:p-6 text-left text-white">
      <h3 className="text-xl md:text-2xl font-serif font-semibold leading-snug line-clamp-3 mb-2">
        {item.title}
      </h3>
      {item.subtitle && (
        <p className="text-sm text-white/80 font-lato line-clamp-2 leading-relaxed mb-4">
          {item.subtitle}
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        <Meta item={item} light />
        <span className="text-sm font-bold text-secondary whitespace-nowrap">
          Leer →
        </span>
      </div>
    </div>
  </Link>
);

const SideCard = ({ item }) => (
  <Link
    to={item.link}
    className="group flex overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(18,23,74,0.06)] hover:shadow-[0_14px_28px_rgba(18,23,74,0.12)] hover:-translate-y-0.5 transition-all duration-300"
  >
    <div className="relative w-[42%] min-w-[128px] max-w-[180px] shrink-0 overflow-hidden bg-slate-200">
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06092E]/25 to-transparent" />
    </div>
    <div className="flex flex-1 flex-col justify-center p-3.5 pr-4 text-left min-w-0">
      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
        Destacada
      </span>
      <h4 className="text-sm font-bold text-primary leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="mt-1 text-xs text-gray-500 font-lato line-clamp-1 leading-relaxed">
          {item.subtitle}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        <Meta item={item} />
        <span className="text-xs font-bold text-secondary whitespace-nowrap">
          Leer →
        </span>
      </div>
    </div>
  </Link>
);

const TileCard = ({ item }) => (
  <Link
    to={item.link}
    className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(18,23,74,0.06)] hover:shadow-[0_16px_32px_rgba(18,23,74,0.12)] hover:-translate-y-0.5 transition-all duration-300 w-full"
  >
    <div className="relative h-44 overflow-hidden bg-slate-200">
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06092E]/40 via-transparent to-transparent" />
      <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow">
        Destacada
      </span>
    </div>
    <div className="flex flex-col flex-1 p-4 text-left">
      <h4 className="text-[15px] font-bold text-primary leading-snug line-clamp-2 mb-1.5 group-hover:text-secondary transition-colors">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="text-sm text-gray-500 font-lato line-clamp-2 leading-relaxed">
          {item.subtitle}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <Meta item={item} />
        <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors whitespace-nowrap">
          Leer →
        </span>
      </div>
    </div>
  </Link>
);

const FeaturedNewsStrip = ({
  items = [],
  variant = "default",
  layout = "strip",
}) => {
  const stripItems = items.map((item, index) => mapNewsItemForCard(item, index));

  if (stripItems.length === 0) return null;

  const isCompact = variant === "home" || variant === "hero";
  const [lead, ...rest] = stripItems;
  const useEditorial = layout === "grid" && stripItems.length >= 3;

  return (
    <div className={isCompact ? "mb-6" : "mb-16"}>
      {layout !== "grid" && (
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-secondary text-center">
          Destacadas
        </p>
      )}

      {useEditorial ? (
        <div
          aria-label="Novedades destacadas"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-left lg:items-stretch"
        >
          <div className="lg:col-span-7 h-full min-h-[280px]">
            <LeadCard item={lead} />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            {rest.slice(0, 3).map((item) => (
              <SideCard key={item.uuid} item={item} />
            ))}
          </div>
        </div>
      ) : layout === "grid" ? (
        <div
          aria-label="Novedades destacadas"
          className={`grid grid-cols-1 ${
            stripItems.length === 1 ? "" : "md:grid-cols-2"
          } gap-4 text-left`}
        >
          {stripItems.map((item) =>
            stripItems.length === 1 ? (
              <LeadCard key={item.uuid} item={item} />
            ) : (
              <TileCard key={item.uuid} item={item} />
            )
          )}
        </div>
      ) : (
        <div
          aria-label="Novedades destacadas"
          className={`flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory ${
            isCompact ? "" : "-mx-1 px-1"
          }`}
        >
          {stripItems.map((item) => (
            <div
              key={item.uuid}
              className={`shrink-0 snap-start ${
                isCompact
                  ? "w-[260px] sm:w-[280px]"
                  : "w-[280px] sm:w-[300px] md:w-[320px]"
              }`}
            >
              <TileCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedNewsStrip;
