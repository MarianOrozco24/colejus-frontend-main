import React from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";

const variantStyles = {
  default: {
    card: "bg-white mb-8 h-[450px]",
    image: "h-44",
    subtitle: "text-gray-500",
    footerBorder: "border-slate-100",
  },
  home: {
    card: "bg-[#f8fafc] min-h-[380px] border border-slate-100",
    image: "h-40",
    subtitle: "text-gray-600",
    footerBorder: "border-slate-50",
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
}) => {
  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <Link
      to={link}
      className={`rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group ${styles.card}`}
    >
      <div>
        <div className={`relative overflow-hidden bg-slate-200 ${styles.image}`}>
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 max-w-[150px] truncate flex flex-wrap gap-1">
            {tags.map((item, index) => (
              <span
                key={index}
                className="bg-[#06092E] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm uppercase"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5">
          <h3
            className="text-sm font-bold text-gray-800 line-clamp-3 leading-snug mb-2 group-hover:text-primary transition-colors"
            title={title}
          >
            {title}
          </h3>
          <p
            className={`text-xs font-lato line-clamp-3 leading-relaxed ${styles.subtitle}`}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div
        className={`p-5 border-t flex items-center justify-between mt-auto ${styles.footerBorder}`}
      >
        <div className="flex flex-col gap-1">
          {dateLabel && (
            <span className="text-gray-400 text-[10px] font-semibold flex items-center gap-1">
              <FaRegCalendarAlt className="text-xs" /> {dateLabel}
            </span>
          )}
          <span className="text-gray-400 text-[10px] font-semibold flex items-center gap-1">
            <FaRegClock className="text-xs" /> {readTime}m
          </span>
        </div>
        <span className="text-xs font-bold text-secondary group-hover:text-primary transition-colors flex items-center gap-1">
          Leer artículo <span>→</span>
        </span>
      </div>
    </Link>
  );
};

export default NewsCard;
