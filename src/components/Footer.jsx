import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Action, Fab } from "react-tiny-fab";
import ContactForm from "./ContactForm";
import { WHATSAPP, whatsappUrl } from "../constants/site";

const Footer = () => {
  const openWhatsApp = (phone) => {
    window.open(whatsappUrl(phone), "_blank", "noopener,noreferrer");
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
                  href={whatsappUrl(WHATSAPP.sanRafael.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-[280px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full inline-flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] text-xs md:text-sm"
                >
                  <FaWhatsapp size={18} />
                  WhatsApp San Rafael
                </a>

                <a
                  href={whatsappUrl(WHATSAPP.alvear.phone)}
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

          <div
            className="md:w-3/5 p-8 md:p-12 text-white flex flex-col justify-center"
            style={{ background: "linear-gradient(135deg, #06092E 0%, #1A1F66 100%)" }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight">
              ¡Hablemos!
            </h2>
            <p className="text-slate-300 font-light max-w-xl text-xs md:text-sm font-lato leading-relaxed mb-8">
              Completá tus datos y te escribimos por WhatsApp. También podés
              contactarnos directo a las sedes de San Rafael o General Alvear.
            </p>

            <ContactForm variant="desktop" />
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

            <span className="flex space-x-4 text-white/80">
              <FaFacebook size={40} aria-hidden="true" />
              <FaInstagram size={40} aria-hidden="true" />
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
            onClick={() => openWhatsApp(WHATSAPP.alvear.phone)}
            style={fabActionStyle}
          >
            <FaWhatsapp className="me-1 ms-1" />
            General Alvear
          </Action>
          <Action
            onClick={() => openWhatsApp(WHATSAPP.sanRafael.phone)}
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
