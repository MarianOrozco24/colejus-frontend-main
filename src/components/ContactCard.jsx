import React from "react";
import { FaMapMarkerAlt, FaIdCard } from "react-icons/fa";

const ContactCard = ({
  name,
  profession,
  email,
  location,
  tuition,
  procurador_professions,
  onClick,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-[0_12px_24px_rgba(18,23,74,0.04)] hover:shadow-[0_20px_40px_rgba(18,23,74,0.1)] hover:-translate-y-1.5 transition-all duration-300 p-6 text-left flex flex-col justify-between font-lato min-h-[220px]">
      <div>
        {/* Header containing name and tuition */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-serif font-bold text-lg md:text-xl text-gray-800 group-hover:text-primary transition-colors duration-300 leading-snug">
            {name}
          </h3>
          <span className="text-[10px] md:text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1">
            <FaIdCard className="text-[10px]" />
            Mat. {tuition || "—"}
          </span>
        </div>

        {/* Professional specialty/title */}
        <p className="text-secondary font-medium text-xs md:text-sm mb-4 uppercase tracking-wider">
          {profession || "Profesional"}
        </p>

        {/* Email */}
        {email && (
          <p className="text-gray-500 text-xs md:text-sm font-light truncate mb-2" title={email}>
            {email}
          </p>
        )}
      </div>

      {/* Footer containing location and button */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
        <div className="flex items-center text-gray-500 text-xs md:text-sm truncate max-w-[60%]">
          <FaMapMarkerAlt className="text-secondary mr-1.5 shrink-0" />
          <span className="text-gray-600 truncate font-light">{location}</span>
        </div>
        <button
          className="bg-slate-50 border border-slate-200 text-gray-700 hover:bg-secondary hover:text-white hover:border-secondary rounded-full px-5 py-2 text-xs md:text-sm font-bold transition-all duration-300 shadow-sm"
          onClick={onClick}
        >
          Contactar
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
