import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileFooter from "../components/MobileFooter";
import NewsCarousel from "../components/NewsCarousel";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      {/* Novedades del Ámbito Jurídico: Visible para todos (escritorio y móvil) */}
      <NewsCarousel />

      {/* DELEGACIONES Y SEDES */}
      <section className="bg-slate-50 py-20 px-6 border-t border-slate-100">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary tracking-tight mb-2">
            Nuestras Delegaciones
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-16 font-lato">
            Presencia institucional y soporte profesional en toda la Segunda Circunscripción Judicial.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* San Rafael */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: "url('/image-2.jpeg')" }}></div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold bg-secondary/15 text-secondary px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block font-lato">
                    Sede Central
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">San Rafael</h3>
                  <p className="text-gray-600 text-sm font-lato leading-relaxed mb-4">
                    Nuestra sede principal concentra la administración general, mesa de entradas, comisiones de trabajo, consultorios de mediación y soporte matricular completo.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-50 text-xs text-gray-500 font-semibold space-y-1 font-lato">
                  <div className="flex items-center gap-1.5">📍 <span>Emilio Civit 257, San Rafael</span></div>
                  <div className="flex items-center gap-1.5">📞 <span>(02627) 422972</span></div>
                </div>
              </div>
            </div>

            {/* General Alvear */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: "url('/image-1.jpeg')" }}></div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold bg-primary/15 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block font-lato">
                    Delegación
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">General Alvear</h3>
                  <p className="text-gray-600 text-sm font-lato leading-relaxed mb-4">
                    Un espacio de soporte matricular y cercanía para los profesionales del departamento, facilitando gestiones locales y la defensa gremial ante los juzgados locales.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-50 text-xs text-gray-500 font-semibold space-y-1 font-lato">
                  <div className="flex items-center gap-1.5">📍 <span>Olascoaga 271, General Alvear</span></div>
                  <div className="flex items-center gap-1.5">💬 <span>Atención y asistencia gremial</span></div>
                </div>
              </div>
            </div>

            {/* Malargüe */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col">
              <div className="h-44 bg-cover bg-center" style={{ backgroundImage: "url('/image-5.jpeg')" }}></div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold bg-primary/15 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block font-lato">
                    Delegación
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Malargüe</h3>
                  <p className="text-gray-600 text-sm font-lato leading-relaxed mb-4">
                    Nuestra representación institucional en el departamento del sur, asegurando el acompañamiento matricular en litigios locales y facilitando trámites ante la sede central.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-50 text-xs text-gray-500 font-semibold space-y-1 font-lato">
                  <div className="flex items-center gap-1.5">📍 <span>Edificio Tribunales Malargüe</span></div>
                  <div className="flex items-center gap-1.5">💬 <span>Gestión y soporte al matriculado</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24 px-4 md:px-0">
        <div 
          className="container mx-auto w-full md:w-3/4 rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-slate-100"
          style={{ background: 'linear-gradient(135deg, #06092E 0%, #1A1F66 100%)' }}
        >
          {/* Mobile logo */}
          <div className="md:hidden flex justify-between items-center p-6">
            <h1 className="text-3xl font-serif font-bold text-white">
              Nosotros
            </h1>
            <img src="/isologo-white.svg" alt="Isologo" className="w-16 h-16 opacity-90" />
          </div>

          {/* Left content section */}
          <div className="p-8 md:w-1/2 md:p-20 relative flex flex-col justify-center items-start text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 hidden md:block text-white">
              Nosotros
            </h1>
            <p
              className="text-slate-200 mb-4 text-sm md:text-base font-light leading-relaxed font-lato"
            >
              El Directorio del Colegio es el órgano de administración y de
              ejecución de las decisiones de Asamblea, así como de las gestiones
              diarias y corrientes de la Institución.
            </p>
            <p
              className="text-slate-200 mb-6 text-sm md:text-base font-light leading-relaxed font-lato"
            >
              Al igual que el Tribunal de Ética, y tal cual lo establece el
              artículo 76 de la Ley 4976, se integra con miembros elegidos a
              través del voto directo y secreto, y duran dos años en sus
              funciones. Se compone de un presidente, siete miembros titulares y
              tres suplentes.
            </p>
            <Link
              to="/nosotros"
              className="text-white border border-white hover:bg-white hover:text-primary px-6 py-2.5 rounded-full inline-block mt-2 transition-all duration-300 font-bold font-lato shadow-sm"
            >
              Conocé más
            </Link>

            {/* Desktop background logo */}
            <div className="absolute hidden md:block right-6 bottom-6 opacity-5 pointer-events-none">
              <img
                src="/isologo.svg"
                alt="Background Isologo"
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Right image section (visible on desktop only) */}
          <div className="hidden md:block md:w-1/2 relative h-inherit">
            <img
              src="/image-2.jpeg"
              alt="Nosotros"
              className="w-full h-full object-cover rounded-r-2xl"
              style={{
                minHeight: "100%",
                maxHeight: "100%",
              }}
            />
            {/* Elegant overlay gradient on image */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#06092E]/25 to-transparent pointer-events-none rounded-r-2xl"></div>
          </div>
        </div>
      </section>

      <div className="hidden md:block">
        <Footer />
      </div>

      {/* New mobile carousel: Only for mobile (below md) */}
      <div className="block md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default Home;
