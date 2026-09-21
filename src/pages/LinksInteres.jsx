import React from "react";
import { Link } from "react-router-dom";
import ResponsiveNav from "../components/ResponsiveNav";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import {
  DIGITAL_TOOLS,
  INTEREST_LINKS,
  isInternalPath,
} from "../constants/site";

const LinkRow = ({ label, href }) => {
  const className =
    "pb-3 border-b border-slate-200 text-gray-700 hover:text-secondary font-medium transition-colors";

  if (isInternalPath(href)) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  );
};

const LinksInteres = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative min-h-[50vh] pb-16 bg-[#06092E] flex flex-col justify-start items-center text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#06092E] via-[#080c3e] to-[#040620] z-0"></div>
        <div className="w-full z-20">
          <ResponsiveNav />
        </div>
        <div className="flex flex-col justify-center items-center text-center z-10 px-6 flex-1 mt-28 md:mt-36">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight">
            Links de interés
          </h1>
          <p className="text-slate-300 font-light max-w-2xl text-sm md:text-base font-lato leading-relaxed">
            Accesos directos a las herramientas del Colegio y a los sitios más
            usados por la matrícula.
          </p>
        </div>
      </header>

      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">
              Herramientas del Colegio
            </h2>
            <div className="flex flex-col space-y-4">
              {DIGITAL_TOOLS.filter((tool) => isInternalPath(tool.link)).map(
                (tool) => (
                  <LinkRow
                    key={tool.name}
                    label={tool.name}
                    href={tool.link}
                  />
                )
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">
              Organismos y consultas
            </h2>
            <div className="flex flex-col space-y-4">
              {INTEREST_LINKS.map((link) => (
                <LinkRow
                  key={link.label}
                  label={link.label}
                  href={link.href}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default LinksInteres;
