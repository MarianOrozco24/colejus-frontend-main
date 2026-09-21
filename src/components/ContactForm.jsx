import React, { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { WHATSAPP, whatsappUrl } from "../constants/site";

const variants = {
  desktop: {
    input:
      "w-full p-3 bg-transparent border-b border-white/20 text-white focus:border-white focus:outline-none font-lato transition-colors duration-300 placeholder-white/30 text-xs md:text-sm",
    textarea:
      "w-full p-3 bg-transparent border-b border-white/20 text-white focus:border-white focus:outline-none font-lato transition-colors duration-300 placeholder-white/30 resize-none text-xs md:text-sm",
    button:
      "bg-white text-[#06092E] font-bold px-8 py-3.5 rounded-full inline-flex items-center justify-center hover:bg-slate-100 hover:scale-[1.02] transition-all duration-300 shadow-[0_4px_15px_rgba(255,255,255,0.15)] text-xs md:text-sm",
    icon: true,
  },
  mobile: {
    input:
      "p-3 bg-transparent border-b border-gray-400 text-white focus:outline-none w-full placeholder-gray-400",
    textarea:
      "p-3 w-full bg-transparent border-b border-gray-400 text-white focus:outline-none placeholder-gray-400",
    button:
      "bg-transparent border border-white px-6 py-3 rounded-full inline-flex items-center justify-center text-white hover:bg-white hover:text-primary transition",
    icon: false,
  },
};

const ContactForm = ({ variant = "desktop" }) => {
  const styles = variants[variant] || variants.desktop;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = [
      "Hola, quiero contactarme con el Colegio.",
      name && `Nombre: ${name}`,
      email && `Email: ${email}`,
      message && `Mensaje: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      whatsappUrl(WHATSAPP.sanRafael.phone, text),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="relative">
          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre y apellido"
            className={styles.input}
          />
          {styles.icon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
              <FaRegCheckCircle />
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={styles.input}
          />
          {styles.icon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
              <FaRegCheckCircle />
            </div>
          )}
        </div>
      </div>
      <div className={`relative ${variant === "desktop" ? "mb-8" : "mb-4"}`}>
        <textarea
          name="message"
          required
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mensaje"
          className={styles.textarea}
        />
        {styles.icon && (
          <div className="absolute right-3 bottom-4 text-white/40">
            <FaRegCheckCircle />
          </div>
        )}
      </div>
      <div className="flex justify-start">
        <button type="submit" className={styles.button}>
          Enviar por WhatsApp
          {variant === "desktop" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
