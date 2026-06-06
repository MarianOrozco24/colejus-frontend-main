import React, { useEffect } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import Footer from "../components/Footer";

const SHOW_TRIBUNAL_ETICA = false;

const COMISIONES_E_INSTITUTOS = [
  { title: "Comisión de Jóvenes" },
  { title: "Comisión Senior" },
  { title: "Instituto de Derecho de Familia" },
  { title: "Instituto de Derecho Administrativo" },
  { title: "Comisión de Cultura" },
  { title: "Instituto de Derecho Laboral" },
  { title: "Instituto de Derecho Comercial" },
  { title: "Instituto de Derecho Ambiental" },
  { title: "Instituto de Derecho Penal, Procesal Penal y Criminología" },
  { title: "Instituto de Derecho de Consumo" },
  { title: "Comisión de Perspectiva de Género e Igualdad" },
  { title: "Instituto de Derecho Constitucional" },
  { title: "Comisión de Mediación, Conciliación y Arbitraje" },
  { title: "Instituto de Seguridad Social" },
  { title: "Comisión de Abogados de General Alvear" },
  { title: "Instituto de Derecho Minero" },
  { title: "Instituto de Derecho Civil" },
  { title: "Comisión de Derecho Agrario" },
  { title: "Comisión de Deportes" },
  { title: "Comisión de Incumbencias" },
  { title: "Comisión de Consultorio Jurídico Gratuito" },
  { title: "Comisión de Asistencia" },
  { title: "Comisión de Estudiantes de Abogacía (3°, 4° y 5° año)" },
  { title: "Comisión de Procuradores" },
];

const Nosotros = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-gray-800 font-lato">
      
      {/* 1. HERO SECTION (DARK ELEGANT) */}
      <header className="relative min-h-[75vh] pb-24 bg-[#06092E] flex flex-col justify-start items-center text-white overflow-hidden">
        {/* Background overlay with a subtle blue gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06092E] via-[#080c3e] to-[#040620] z-0"></div>

        {/* Navbar */}
        <div className="w-full z-20">
          <ResponsiveNav />
        </div>

        {/* Hero Title Content */}
        <div className="flex flex-col justify-center items-center text-center z-10 px-6 flex-1 mt-28 md:mt-40">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-tight leading-tight max-w-4xl">
            Conocé el Colegio
          </h1>
          <p className="text-lg md:text-xl font-light max-w-3xl leading-relaxed text-slate-300">
            Te presentamos nuestro Directorio, Institutos y Comisiones.
            Compromiso, ética y formación académica al servicio del derecho.
          </p>
        </div>

        {/* Mission and Vision Grid inside Hero (Minimal, Elegant, No Icons) */}
        <section className="w-full px-6 mt-16 md:px-24 z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Misión */}
            <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/10 border-l-4 border-l-secondary shadow-lg transition-all duration-300 hover:bg-white/[0.05] hover:scale-[1.005]">
              <h3 className="text-xl font-serif font-bold text-white mb-3 tracking-wide">
                Nuestra Misión
              </h3>
              <p className="text-sm leading-relaxed text-slate-300 font-light">
                Brindar el mejor servicio a nuestros colegiados y a la comunidad, gestionando con transparencia y representando al Colegio ante otras instituciones con firmeza y decoro.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/10 border-l-4 border-l-secondary shadow-lg transition-all duration-300 hover:bg-white/[0.05] hover:scale-[1.005]">
              <h3 className="text-xl font-serif font-bold text-white mb-3 tracking-wide">
                Nuestra Visión
              </h3>
              <p className="text-sm leading-relaxed text-slate-300 font-light">
                Promover el ejercicio ético de la profesión y fomentar el desarrollo profesional de nuestros abogados, impulsando la formación y la actualización constante en la región.
              </p>
            </div>

          </div>
        </section>
      </header>

      {/* 2. HISTORIA SECTION (LIGHT, EDITORIAL STYLE) */}
      <section className="bg-white py-24 px-6 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] block mb-2">Trayectoria</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Nuestra Historia
            </h2>
            <div className="w-16 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[16px] md:text-[17px] text-justify leading-relaxed text-gray-600 font-lato">
            <div className="space-y-6">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                Con la sanción de la Ley Provincial 1525 en el año 1942, nació en San Rafael – sede de la Segunda Circunscripción Judicial – una corriente decidida a fundar un Colegio Público de Abogados y Procuradores.
              </p>
              <p>
                Esta iniciativa se concretó un año más tarde, en septiembre de 1943, cuando se funda el Colegio Público de Abogados y Procuradores de la Segunda Circunscripción Judicial de Mendoza, que nuclea a los profesionales del Derecho de San Rafael, General Alvear y Malargüe.
              </p>
              <p>
                Desde su origen, el Colegio participa activamente en actividades y gestiones que promueven el ejercicio ético y responsable de la abogacía.
              </p>
            </div>
            <div className="space-y-6">
              <p>
                La Ley 4976 establece en su artículo 62 que en cada Circunscripción Judicial funcionará un Colegio con carácter de derecho público no estatal, dotado de autonomía para representar a sus matriculados.
              </p>
              <p>
                Actualmente, el Colegio continúa su crecimiento con comisiones activas, participación en federaciones profesionales y una firme defensa de los intereses de la abogacía.
              </p>
              <p className="italic font-serif text-primary border-l-2 border-secondary pl-4 py-2 my-4">
                «No basta que cada abogado sea bueno; es preciso que, juntos, todos los abogados seamos algo».
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIRECTORIO SECTION (CORPORATE BOARD STYLE WITH HIGH CONTRAST) */}
      <section id="directorio" className="bg-slate-100 py-24 px-6 md:px-8 border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] block mb-2">Autoridades</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Directorio del Colegio
            </h2>
            <div className="w-16 h-1 bg-secondary mx-auto"></div>
          </div>

          {/* HIERARCHY GRID - FEATURED LEADER CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Presidente Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_10px_30px_rgba(18,23,74,0.04)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary"></div>
              <div>
                <span className="text-[10px] font-bold text-secondary tracking-widest uppercase block mb-2">Presidente</span>
                <h3 className="text-2xl font-serif font-bold text-primary">Dr. Gustavo Delpozzi</h3>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-gray-400">
                Directorio Ejecutivo • 2026 - 2028
              </div>
            </div>

            {/* Vicepresidente Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_10px_30px_rgba(18,23,74,0.04)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary"></div>
              <div>
                <span className="text-[10px] font-bold text-secondary tracking-widest uppercase block mb-2">Vicepresidente</span>
                <h3 className="text-2xl font-serif font-bold text-primary">Dr. Diego Tercero</h3>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-gray-400">
                Directorio Ejecutivo • 2026 - 2028
              </div>
            </div>

          </div>

          {/* MAIN OFFICERS ROW (4 Columns Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            {/* Secretaria */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div>
                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">Secretaria</span>
                <h4 className="text-base font-bold text-primary">Dra. Fátima Sat</h4>
              </div>
            </div>

            {/* Tesorero */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div>
                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">Tesorero</span>
                <h4 className="text-base font-bold text-primary">Dr. Sebastián Gijón</h4>
              </div>
            </div>

            {/* Prosecretaria */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div>
                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">Prosecretaria</span>
                <h4 className="text-base font-bold text-primary">Dra. Liliana Baldoni</h4>
              </div>
            </div>

            {/* Protesorero */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div>
                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">Protesorero</span>
                <h4 className="text-base font-bold text-primary">Dr. Guillermo Fliguer</h4>
              </div>
            </div>

          </div>

          {/* SECRETARIOS DE PRENSA */}
          <div className="border-t border-slate-200 pt-16 mb-16">
            <h3 className="text-xl font-serif text-primary text-center font-bold mb-10 tracking-wide uppercase">Secretarios de Prensa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Dr. Federico Cerdá Sundermann', telefono: '2604617285' },
                { name: 'Dra. María Paula Herrera Poblet', telefono: '2604607841' },
                { name: 'Dra. Karen Georgina Vargas', telefono: '2604098418' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div>
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">Secretario/a de Prensa</span>
                    <h4 className="text-base font-bold text-primary mb-2">{item.name}</h4>
                    <a
                      href={`tel:${item.telefono}`}
                      className="text-xs text-secondary font-semibold hover:underline inline-block"
                    >
                      Tel. {item.telefono}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VOCALES / DIRECTORES GRID */}
          <div className="border-t border-slate-200 pt-16">
            <h3 className="text-xl font-serif text-primary text-center font-bold mb-10 tracking-wide uppercase">Directores Vocales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: 'Dra. Laura Cordero', cargo: 'Directora Vocal' },
                { name: 'Dr. Diego Silvestre', cargo: 'Director Vocal' },
                { name: 'Dra. Naim Yapur', cargo: 'Directora Vocal' },
                { name: 'Dr. Samir Alí Sat', cargo: 'Director Vocal' },
                { name: 'Dr. Juan Antonio Parra', cargo: 'Director Vocal' },
                { name: 'Dra. Valentina Llorente', cargo: 'Directora Vocal' },
                { name: 'Dr. Gonzalo E. Pagliano', cargo: 'Director Vocal' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div>
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">{item.cargo}</span>
                    <h4 className="text-base font-bold text-primary">{item.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DELEGADOS */}
          <div className="border-t border-slate-200 pt-16 mt-16">
            <h3 className="text-xl font-serif text-primary text-center font-bold mb-10 tracking-wide uppercase">Delegados Departamentales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              
              {/* Delegado General Alvear */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div>
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">Delegado Gral. Alvear</span>
                  <h4 className="text-base font-bold text-primary">Dr. Juan Soratto</h4>
                </div>
              </div>

              {/* Delegado Malargüe */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div>
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">Delegado Malargüe</span>
                  <h4 className="text-base font-bold text-primary">Dr. Jorge Benjamín Mayoral</h4>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. TRIBUNAL DE ETICA SECTION — oculto hasta confirmar autoridades */}
      {SHOW_TRIBUNAL_ETICA && (
      <section className="bg-slate-100 py-24 px-6 text-gray-900 border-b border-slate-200/50">
        <div className="container mx-auto max-w-5xl">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] block mb-2">Tribunal</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Tribunal de Ética
            </h2>
            <div className="w-16 h-1 bg-secondary mx-auto"></div>
          </div>

          {/* PRESIDENTE FEATURED */}
          <div className="bg-white border border-slate-200 rounded-2xl py-8 px-6 max-w-xl mx-auto mb-12 text-center shadow-[0_10px_30px_rgba(18,23,74,0.04)] border-t-4 border-t-primary">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">Presidente del Tribunal</span>
            <h3 className="text-2xl font-serif font-bold text-primary mb-2">Dr. Horacio Boldrini</h3>
            <p className="text-xs italic text-gray-500 font-lato max-w-xs mx-auto">“Ejercicio ético y responsable en la defensa y decoro de la abogacía.”</p>
          </div>

          {/* TITULARES & SUPLENTES WRAPPED IN A PREMIUM WHITE CONTAINER CARD */}
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* MIEMBROS TITULARES */}
              <div>
                <h3 className="text-lg font-serif font-bold text-primary mb-6 pb-2 border-b border-slate-100 uppercase tracking-wider text-center md:text-left">
                  Miembros Titulares
                </h3>
                <div className="space-y-4">
                  {[
                    "Dra. Guillén Alida E. N.",
                    "Dr. Llorente Ernesto",
                    "Dr. Herrera Abalos Jorge",
                    "Dr. Juri Sticca Alfredo",
                    "Dr. Angriman Juan Marcos",
                    "Dra. Masini María Pía"
                  ].map((nombre, i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-[15px] font-semibold text-gray-700">{nombre}</span>
                      <span className="text-[10px] text-secondary bg-secondary/5 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">Vocal</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MIEMBROS SUPLENTES */}
              <div>
                <h3 className="text-lg font-serif font-bold text-primary mb-6 pb-2 border-b border-slate-100 uppercase tracking-wider text-center md:text-left">
                  Miembros Suplentes
                </h3>
                <div className="space-y-4">
                  {[
                    "Dr. Piedecasas Juan Manuel",
                    "Dr. Germanó Pablo",
                    "Dr. Correa Santiago Tomas",
                    "Dr. Fajardo Martin Luis",
                    "Dr. Fernandez Tíndaro",
                    "Dr. Bondino Miguel Angel",
                    "Dr. Andres Adriel"
                  ].map((nombre, i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-[15px] font-medium text-gray-600">{nombre}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">Suplente</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
      )}

      {/* 5. COMISIONES E INSTITUTOS SECTION (DARK, MODERN MINIMALIST CARDS) */}
      <section className="bg-[#0A0F2C] py-24 px-6">
        <div className="container mx-auto text-center">
          
          <div className="mb-16">
            <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] block mb-2">Comunidades</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Comisiones e Institutos
            </h2>
            <div className="w-16 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {COMISIONES_E_INSTITUTOS.map((item, i) => (
              <div
                key={i}
                className="group bg-[#151A39]/60 hover:bg-[#1C234E] rounded-2xl p-6 text-center border-t-2 border-primary/20 hover:border-t-secondary hover:-translate-y-1 transition-all duration-300 shadow-sm flex flex-col justify-center min-h-[140px] border border-white/[0.02]"
              >
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-secondary transition-colors duration-300">
                  {item.title}
                </h3>
                {item.name && (
                  <p className="text-xs text-slate-400 font-light font-lato">{item.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LINKS DE INTERES SECTION (MINIMALIST) */}
      <section className="bg-white pt-12 pb-24 border-t border-slate-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-lg font-serif font-bold text-primary uppercase tracking-wider">Enlaces de Interés</h3>
            <div className="w-10 h-0.5 bg-secondary mx-auto mt-2"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 max-w-4xl mx-auto px-6">
            {[
              { label: "Poder judicial Mza", href: "#poder-judicial-mza" },
              { label: "Listas diarias", href: "#listas-diarias" },
              { label: "Notificaciones", href: "#notificaciones" },
              { label: "ATM", href: "#atm" },
              { label: "FACA", href: "#faca" },
              { label: "Tasas Judiciales", href: "#tasas-judiciales" },
              { label: "Caja Forense", href: "#caja-forense" },
              { label: "Valor de JUS", href: "#valor-jus" },
            ].map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-lato text-gray-500 hover:text-secondary font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Nosotros;
