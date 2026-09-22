import React from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";

const variantStyles = {
  default: {
    card: "bg-white mb-8",
    image: "h-44",
    subtitle: "text-gray-500",
    footerBorder: "border-slate-100",
    bodyPad: "p-5",
    footerPad: "p-5",
  },
  home: {
    card: "bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(18,23,74,0.06)]",
    image: "h-32",
    subtitle: "text-gray-600",
    footerBorder: "border-slate-100",
    bodyPad: "px-4 pt-3.5 pb-2",
    footerPad: "px-4 py-2.5",
  },
  hero: {
    card: "bg-white min-h-0 border border-slate-200/80",
    image: "h-28",
    subtitle: "text-gray-600",
    footerBorder: "border-slate-100",
    bodyPad: "p-4",
    footerPad: "px-4 py-3",
  },
};

const NewsCard = ({
  title,
  subtitle,
  dateLabel,
  readTime,
  tags,
  image,
  link,
  variant = "default",
  isFeatured = false,
}) => {
  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <Link
      to={link}
      className={`rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group ${
        variant === "home" ? "" : "justify-between"
      } ${styles.card}`}
    >
      <div>
        <div className={`relative overflow-hidden bg-slate-200 ${styles.image}`}>
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 max-w-[160px] flex flex-wrap gap-1">
            {isFeatured && (
              <span className="bg-secondary text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm uppercase">
                Destacada
              </span>
            )}
            {variant !== "home" &&
              (tags || []).slice(0, 3).map((item, index) => (
                <span
                  key={index}
                  className="bg-[#06092E] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm uppercase"
                >
                  {item.name}
                </span>
              ))}
          </div>
        </div>
        <div className={styles.bodyPad || "p-5"}>
          <h3
            className={`text-sm font-bold text-gray-800 line-clamp-2 leading-snug mb-1.5 group-hover:text-primary transition-colors ${
              variant === "home" ? "min-h-[2.5rem]" : ""
            }`}
            title={title}
          >
            {title}
          </h3>
          <p
            className={`text-xs font-lato leading-relaxed ${
              variant === "home" ? "line-clamp-1" : "line-clamp-2"
            } ${styles.subtitle}`}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div
        className={`${styles.footerPad || "p-5"} border-t flex items-center justify-between ${
          variant === "home" ? "" : "mt-auto"
        } ${styles.footerBorder}`}
      >
        <div className="flex items-center gap-3">
          {dateLabel && (
            <span className="text-gray-400 text-[10px] font-semibold flex items-center gap-1">
              <FaRegCalendarAlt className="text-xs" /> {dateLabel}
            </span>
          )}
          <span className="text-gray-400 text-[10px] font-semibold flex items-center gap-1">
            <FaRegClock className="text-xs" /> {readTime}m
          </span>
        </div>
        <span className="text-xs font-bold text-secondary group-hover:text-primary transition-colors whitespace-nowrap">
          {variant === "home" ? "Leer →" : "Leer artículo →"}
        </span>
      </div>
    </Link>
  );
};

export default NewsCard;
