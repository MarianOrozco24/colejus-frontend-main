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
      <section className="bg-slate-100 py-20 px-6 border-t border-slate-200/60">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary tracking-tight mb-2">
            Nuestras Delegaciones
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-16 font-lato">
            Presencia institucional y soporte profesional en toda la Segunda Circunscripción Judicial.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* San Rafael */}
            <div className="group bg-white rounded-2xl shadow-[0_15px_30px_rgba(18,23,74,0.07)] hover:shadow-[0_25px_50px_rgba(18,23,74,0.15)] hover:-translate-y-2.5 hover:scale-[1.01] transition-all duration-500 ease-out overflow-hidden border border-slate-200/90 border-t-4 border-t-secondary flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div 
                  className="h-full w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                  style={{ backgroundImage: "url('/image-2.jpeg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#12174A]/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block font-lato border border-secondary/10">
                    Sede Central
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
                    San Rafael
                  </h3>
                  <p className="text-gray-600 text-sm font-lato leading-relaxed mb-6">
                    Nuestra sede principal concentra la administración general, mesa de entradas, comisiones de trabajo, consultorios de mediación y soporte matricular completo.
                  </p>
                </div>
                <div className="pt-5 border-t border-slate-100 text-xs text-gray-500 space-y-3 font-lato">
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] shrink-0 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-secondary group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <span className="font-medium">Emilio Civit 257, San Rafael</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] shrink-0 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-secondary group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.622C2.25 14.152 8.348 20.25 15.878 20.25h.142c1.78-.012 3.224-1.442 3.224-3.224a1.724 1.724 0 00-1.066-1.587l-2.735-1.094a1.724 1.724 0 00-1.938.505l-1.094 1.458c-2.485-1.282-4.526-3.323-5.808-5.808l1.458-1.094a1.724 1.724 0 00.505-1.938L8.602 4.331A1.724 1.724 0 007.015 3.224c-1.782 0-3.212 1.442-3.224 3.224h.06z" />
                      </svg>
                    </span>
                    <span className="font-medium">(02627) 422972</span>
                  </div>
                </div>
              </div>
            </div>

            {/* General Alvear */}
            <div className="group bg-white rounded-2xl shadow-[0_15px_30px_rgba(18,23,74,0.07)] hover:shadow-[0_25px_50px_rgba(18,23,74,0.15)] hover:-translate-y-2.5 hover:scale-[1.01] transition-all duration-500 ease-out overflow-hidden border border-slate-200/90 border-t-4 border-t-primary flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div 
                  className="h-full w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                  style={{ backgroundImage: "url('/image-1.jpeg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#12174A]/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block font-lato border border-primary/10">
                    Delegación
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
                    General Alvear
                  </h3>
                  <p className="text-gray-600 text-sm font-lato leading-relaxed mb-6">
                    Un espacio de soporte matricular y cercanía para los profesionales del departamento, facilitando gestiones locales y la defensa gremial ante los juzgados locales.
                  </p>
                </div>
                <div className="pt-5 border-t border-slate-100 text-xs text-gray-500 space-y-3 font-lato">
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] shrink-0 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-secondary group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <span className="font-medium">Olascoaga 271, General Alvear</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] shrink-0 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-secondary group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                    <span className="font-medium">Atención y asistencia gremial</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Malargüe */}
            <div className="group bg-white rounded-2xl shadow-[0_15px_30px_rgba(18,23,74,0.07)] hover:shadow-[0_25px_50px_rgba(18,23,74,0.15)] hover:-translate-y-2.5 hover:scale-[1.01] transition-all duration-500 ease-out overflow-hidden border border-slate-200/90 border-t-4 border-t-primary flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <div 
                  className="h-full w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                  style={{ backgroundImage: "url('/image-5.jpeg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#12174A]/10 to-transparent pointer-events-none"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block font-lato border border-primary/10">
                    Delegación
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
                    Malargüe
                  </h3>
                  <p className="text-gray-600 text-sm font-lato leading-relaxed mb-6">
                    Nuestra representación institucional en el departamento del sur, asegurando el acompañamiento matricular en litigios locales y facilitando trámites ante la sede central.
                  </p>
                </div>
                <div className="pt-5 border-t border-slate-100 text-xs text-gray-500 space-y-3 font-lato">
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] shrink-0 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-secondary group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <span className="font-medium">Edificio Tribunales Malargüe</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] shrink-0 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-secondary group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                    <span className="font-medium">Gestión y soporte al matriculado</span>
                  </div>
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
