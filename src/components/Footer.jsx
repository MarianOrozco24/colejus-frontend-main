import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaRegCheckCircle } from "react-icons/fa";
import { Action, Fab } from "react-tiny-fab";

const Footer = () => {
  const openWhatsApp = (number) => {
    window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer");
  };

  const fabActionStyle = {
    backgroundColor: "#5BB754",
    display: "flex",
    alignItems: "center",
    width: "150px",
    height: "48px",
    borderRadius: "15px",
    padding: "8px",
    fontFamily: "Lato",
    fontWeight: 400,
    justifyContent: "start",
  };

  return (
    <>
      <section className="bg-white 2xl:text-base md:text-sm">
        <div className="bg-primary shadow-lg flex flex-col md:flex-row overflow-hidden">
          <div
            className="relative md:w-2/5 flex items-center justify-center p-8 md:p-12 shrink-0 min-h-[300px]"
            style={{
              background: `linear-gradient(0deg, rgba(6, 9, 46, 0.75) 0%, rgba(6, 9, 46, 0.75) 100%), 
                    url('/contact-us-image.jpeg') lightgray 50% / cover no-repeat`,
            }}
          >
            <div className="relative z-10 text-center flex flex-col items-center">
              <img
                src="/logo-grande.png"
                alt="Colegio Público de Abogados y Procuradores"
                className="mx-auto mb-6 2xl:h-20 md:h-14 shrink-0"
              />

              <div className="flex flex-col space-y-4 items-center w-full">
                <a
                  href="https://wa.me/5492604600555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-[280px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full inline-flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] text-xs md:text-sm"
                >
                  <FaWhatsapp size={18} />
                  WhatsApp San Rafael
                </a>

                <a
                  href="https://wa.me/5492604118463"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-[280px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full inline-flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] text-xs md:text-sm"
                >
                  <FaWhatsapp size={18} />
                  WhatsApp Alvear
                </a>
              </div>
            </div>
          </div>

          {/* Right Side (Contact Form - Refined Hablemos) */}
          <div 
            className="md:w-3/5 p-8 md:p-12 text-white flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg, #06092E 0%, #1A1F66 100%)' }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight">
              ¡Hablemos!
            </h2>
            <p className="text-slate-300 font-light max-w-xl text-xs md:text-sm font-lato leading-relaxed mb-8">
              Si querés contactarte con el Colegio de Abogados y Procuradores de forma directa, completá tus datos a continuación.
            </p>

            {/* Contact Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nombre y apellido"
                    className="w-full p-3 bg-transparent border-b border-white/20 text-white focus:border-white focus:outline-none font-lato transition-colors duration-300 placeholder-white/30 text-xs md:text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
                    <FaRegCheckCircle />
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 bg-transparent border-b border-white/20 text-white focus:border-white focus:outline-none font-lato transition-colors duration-300 placeholder-white/30 text-xs md:text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
                    <FaRegCheckCircle />
                  </div>
                </div>
              </div>
              <div className="mb-8 relative">
                <textarea
                  placeholder="Mensaje"
                  rows={3}
                  className="w-full p-3 bg-transparent border-b border-white/20 text-white focus:border-white focus:outline-none font-lato transition-colors duration-300 placeholder-white/30 resize-none text-xs md:text-sm"
                />
                <div className="absolute right-3 bottom-4 text-white/40">
                  <FaRegCheckCircle />
                </div>
              </div>
              <div className="flex justify-start">
                <button className="bg-white text-[#06092E] font-bold px-8 py-3.5 rounded-full inline-flex items-center justify-center hover:bg-slate-100 hover:scale-[1.02] transition-all duration-300 shadow-[0_4px_15px_rgba(255,255,255,0.15)] text-xs md:text-sm">
                  Enviar mensaje
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-6 w-full h-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 h-full">
          <div className="flex justify-between items-center h-full">
            <div>
              <p className="text-sm">
                Segunda Circunscripción Judicial de Mendoza. <br />
                (San Rafael - Gral. Alvear - Malargüe)
              </p>
            </div>

            <div>
              <img src="/logo-colegio.png" alt="Logo" className="h-12 w-auto" />
            </div>

            <span className="flex space-x-4">
              <FaFacebook size={40} />
              <FaInstagram size={40} />
            </span>
          </div>
        </div>

        <Fab
          mainButtonStyles={{ backgroundColor: "#5BB754" }}
          position={{ bottom: 24, right: 24 }}
          icon={<FaWhatsapp size={28} />}
          alwaysShowTitle={false}
        >
          <Action
            onClick={() => openWhatsApp("542604118463")}
            style={fabActionStyle}
          >
            <FaWhatsapp className="me-1 ms-1" />
            General Alvear
          </Action>
          <Action
            onClick={() => openWhatsApp("542604600555")}
            style={fabActionStyle}
          >
            <FaWhatsapp className="me-1 ms-1" />
            San Rafael
          </Action>
        </Fab>
      </footer>
    </>
  );
};

export default Footer;
