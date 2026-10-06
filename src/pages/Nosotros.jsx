import React, { useEffect, useMemo, useRef, useState } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import Footer from "../components/Footer";
import { FaFilePdf, FaSearch, FaTimes } from "react-icons/fa";
import { INTEREST_LINKS } from "../constants/site";

const REGLAMENTO_INSTITUTOS_PDF = "/docs/reglamento-institutos-comisiones.pdf";

const ANIO_FUNDACION = 1943;

const SECCIONES = [
  { id: "historia", label: "Historia", corto: "Historia" },
  { id: "directorio", label: "Directorio", corto: "Directorio" },
  { id: "tribunal", label: "Tribunal de Ética", corto: "Tribunal" },
  { id: "comisiones", label: "Comisiones e Institutos", corto: "Comisiones" },
];

const COORDINADOR_COMISIONES = {
  role: "Coordinador de Comisiones e Institutos",
  name: "Dr. Anuar Sat",
};

const AUTORIDADES_PRINCIPALES = [
  { cargo: "Presidente", name: "Dr. Gustavo Delpozzi" },
  { cargo: "Vicepresidente", name: "Dr. Diego Tercero" },
];

const OFICIALES = [
  { cargo: "Secretaria", name: "Dra. Fátima Sat" },
  { cargo: "Tesorero", name: "Dr. Sebastián Gijón" },
  { cargo: "Prosecretaria", name: "Dra. Liliana Baldoni" },
  { cargo: "Protesorero", name: "Dr. Guillermo Fliguer" },
];

const SECRETARIOS_PRENSA = [
  { name: "Dr. Federico Cerdá Sundermann", telefono: "2604617285" },
  { name: "Dra. María Paula Herrera Poblet", telefono: "2604607841" },
  { name: "Dra. Karen Georgina Vargas", telefono: "2604098418" },
];

const DIRECTORES_VOCALES = [
  { name: "Dra. Laura Cordero", cargo: "Directora Vocal" },
  { name: "Dr. Diego Silvestre", cargo: "Director Vocal" },
  { name: "Dra. Naim Yapur", cargo: "Directora Vocal" },
  { name: "Dr. Samir Alí Sat", cargo: "Director Vocal" },
  { name: "Dr. Juan Antonio Parra", cargo: "Director Vocal" },
  { name: "Dra. Valentina Llorente", cargo: "Directora Vocal" },
  { name: "Dr. Gonzalo E. Pagliano", cargo: "Director Vocal" },
];

const DELEGADOS = [
  { cargo: "Delegado Gral. Alvear", name: "Dr. Juan Soratto" },
  { cargo: "Delegado Malargüe", name: "Dr. Jorge Benjamín Mayoral" },
];

const INSPECCION_RECAUDACION = [
  "Dra. Cecilia Orozco",
  "Dr. Rodrigo Hernando",
  "Dra. Luciana Reyes",
  "Dr. Manuel Vizcaino",
];

const TRIBUNAL_ETICA = {
  presidente: "Dr. Horacio Boldrini",
  secretaria: "Dra. Tatiana Nigro",
  titulares: [
    "Dr. Pablo Tarazaga",
    "Dr. Ernesto Llorente",
    "Dr. Jorge Herrera Ábalos",
    "Dr. Mauricio Dellagnolo",
    "Dra. Alida E. N. Guillén",
  ],
  suplentes: [
    "Dr. Vicente Zavattieri",
    "Dr. Martín Fajardo",
    "Dr. Juan Manuel Piedecasas",
    "Dr. Pablo Germanó",
    "Dr. Ricardo Gatica",
    "Dr. Adriel Andrés",
    "Dra. Carina Oliva",
  ],
};

const COMISIONES_E_INSTITUTOS = [
  {
    title: "Instituto Derecho Penal, Procesal Penal y Criminología",
    presidente: "Mariela Herrera",
    secretaria: "Marina López",
  },
  {
    title: "Instituto Seguridad Social",
    presidente: "Bibiana López Olivieri",
    secretaria: "Rosmari Ramos",
  },
  {
    title: "Comisión Derecho Agrario y Rural",
    presidente: "Gustavo Juárez",
    secretaria: "Juan Campi Araujo",
  },
  {
    title: "Instituto Derecho Minero, Hidrocarburos y Energía Renovables",
    presidente: "Luis Jofré",
    secretaria: "Noelia Pascucci",
  },
  {
    title: "Comisión de Mediación, Conciliación y Arbitraje",
    presidente: "Matilde Pronotto",
  },
  {
    title: "Instituto Derecho Comercial",
    presidente: "Mario Gutiérrez",
    secretaria: "Valentín Gutiérrez Alias",
  },
  {
    title: "Instituto Derecho Laboral",
    presidente: "Rodrigo Hernando",
  },
  {
    title: "Instituto de las Familias",
    presidente: "Pía Masini",
    secretaria: "Karen Vargas",
  },
  {
    title: "Instituto Derecho de Consumo",
    presidente: "Cecilia A. Martínez",
  },
  {
    title: "Comisión de Perspectiva de Género e Igualdad",
    presidente: "Cecilia A. Martínez",
  },
  {
    title: "Comisión de Abogados Malargüe",
    presidente: "Celeste Espina",
  },
  {
    title: "Comisión Consultorio J Gratuito",
    presidente: "Axel Kurt Ottosen",
  },
  {
    title: "Comisión de Jóvenes Abogados",
    presidente: "Pablo De Luca",
    secretaria: "Noelia Agostina Rodriguez",
  },
  {
    title: "Instituto de Derecho Civil",
    presidente: "María Valentina Becerra Dauverné",
  },
];

const tipoDeComision = (item) =>
  item.title.startsWith("Instituto") ? "instituto" : "comision";

const FILTROS_COMISIONES = [
  { id: "todos", label: "Todos" },
  { id: "instituto", label: "Institutos" },
  { id: "comision", label: "Comisiones" },
];

const normalizar = (texto = "") =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const iniciales = (nombre) => {
  const partes = nombre
    .replace(/^Dra?\.\s*/, "")
    .split(/\s+/)
    .filter((parte) => parte && !parte.endsWith("."));
  if (partes.length === 0) return "";
  const primera = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return `${primera}${ultima}`.toUpperCase();
};

const Reveal = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Avatar = ({ name, size = "md" }) => {
  const sizes = {
    md: "w-11 h-11 text-sm bg-primary/5 text-primary ring-1 ring-primary/10 group-hover:bg-primary group-hover:text-white",
    lg: "w-16 h-16 text-xl bg-primary text-white ring-4 ring-primary/10",
  };
  return (
    <div
      aria-hidden="true"
      className={`${sizes[size]} shrink-0 rounded-full flex items-center justify-center font-serif font-bold tracking-wide transition-colors duration-300`}
    >
      {iniciales(name)}
    </div>
  );
};

const PersonCard = ({ cargo, name, delay = 0, children }) => (
  <Reveal delay={delay} className="h-full">
    <div className="group h-full bg-white rounded-xl p-6 border border-slate-200 shadow-md flex items-center gap-4 transition-all hover:shadow-lg hover:-translate-y-0.5">
      <Avatar name={name} />
      <div className="min-w-0">
        <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block mb-1">{cargo}</span>
        <h4 className="text-base font-bold text-primary">{name}</h4>
        {children}
      </div>
    </div>
  </Reveal>
);

const SectionHeading = ({ eyebrow, title, dark = false }) => (
  <Reveal className="text-center mb-16">
    <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] block mb-2">{eyebrow}</span>
    <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-4 ${dark ? "text-white" : "text-primary"}`}>
      {title}
    </h2>
    <div className="w-16 h-1 bg-secondary mx-auto"></div>
  </Reveal>
);

const useSeccionActiva = (ids) => {
  const [activa, setActiva] = useState(ids[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiva(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [ids]);

  return activa;
};

const SECCION_IDS = SECCIONES.map((seccion) => seccion.id);

const IndiceSecciones = () => {
  const activa = useSeccionActiva(SECCION_IDS);

  const irA = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Secciones de la página"
      className="sticky top-16 z-20 bg-white/95 backdrop-blur border-b border-slate-200 md:h-0 md:top-[108px] xl:top-[120px] 2xl:top-[136px] md:bg-transparent md:border-0 md:backdrop-blur-none md:flex md:justify-center"
    >
      <div className="flex gap-0.5 md:gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] md:overflow-visible md:-translate-y-1/2 md:h-fit md:px-1.5 md:py-1.5 md:rounded-full md:bg-white/90 md:backdrop-blur-md md:border md:border-slate-200 md:shadow-[0_10px_30px_rgba(18,23,74,0.12)]">
        {SECCIONES.map((seccion) => (
          <a
            key={seccion.id}
            href={`#${seccion.id}`}
            onClick={(event) => irA(event, seccion.id)}
            aria-current={activa === seccion.id ? "true" : undefined}
            className={`flex-1 md:flex-none text-center whitespace-nowrap rounded-full px-2 md:px-4 py-2 text-xs md:text-sm font-semibold transition-colors duration-300 ${
              activa === seccion.id
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:text-primary hover:bg-slate-100"
            }`}
          >
            <span className="md:hidden">{seccion.corto}</span>
            <span className="hidden md:inline">{seccion.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

const DATOS_DESTACADOS = [
  { valor: ANIO_FUNDACION, label: "Año de fundación" },
  { valor: new Date().getFullYear() - ANIO_FUNDACION, label: "Años de trayectoria" },
  { valor: 3, label: "Departamentos" },
  { valor: COMISIONES_E_INSTITUTOS.length, label: "Comisiones e institutos" },
];

const Nosotros = () => {
  const [filtroComisiones, setFiltroComisiones] = useState("todos");
  const [busquedaComisiones, setBusquedaComisiones] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const conteoPorTipo = useMemo(
    () => ({
      todos: COMISIONES_E_INSTITUTOS.length,
      instituto: COMISIONES_E_INSTITUTOS.filter((item) => tipoDeComision(item) === "instituto").length,
      comision: COMISIONES_E_INSTITUTOS.filter((item) => tipoDeComision(item) === "comision").length,
    }),
    []
  );

  const comisionesFiltradas = useMemo(() => {
    const termino = normalizar(busquedaComisiones.trim());
    return COMISIONES_E_INSTITUTOS.filter((item) => {
      if (filtroComisiones !== "todos" && tipoDeComision(item) !== filtroComisiones) return false;
      if (!termino) return true;
      return [item.title, item.presidente, item.secretaria].some((campo) =>
        normalizar(campo).includes(termino)
      );
    });
  }, [filtroComisiones, busquedaComisiones]);

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

        {/* Datos destacados */}
        <section className="w-full px-6 mt-14 md:px-24 z-10">
          <dl className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 md:divide-x md:divide-white/10">
            {DATOS_DESTACADOS.map((dato) => (
              <div key={dato.label} className="text-center px-4">
                <dd className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                  {dato.valor}
                </dd>
                <dt className="mt-2 text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">
                  {dato.label}
                </dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Mission and Vision Grid inside Hero (Minimal, Elegant, No Icons) */}
        <section className="w-full px-6 mt-14 md:px-24 z-10">
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

      <IndiceSecciones />

      {/* 2. HISTORIA SECTION (LIGHT, EDITORIAL STYLE) */}
      <section id="historia" className="bg-white py-24 px-6 border-b border-slate-100 scroll-mt-28 md:scroll-mt-36 2xl:scroll-mt-40">
        <div className="container mx-auto max-w-5xl">
          
          <SectionHeading eyebrow="Trayectoria" title="Nuestra Historia" />

          <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[16px] md:text-[17px] text-justify leading-relaxed text-gray-600 font-lato">
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
          </Reveal>
        </div>
      </section>

      {/* 3. DIRECTORIO SECTION (CORPORATE BOARD STYLE WITH HIGH CONTRAST) */}
      <section id="directorio" className="bg-slate-100 py-24 px-6 md:px-8 border-b border-slate-200/50 scroll-mt-28 md:scroll-mt-36 2xl:scroll-mt-40">
        <div className="max-w-6xl mx-auto">
          
          <SectionHeading eyebrow="Autoridades" title="Directorio del Colegio" />

          {/* HIERARCHY GRID - FEATURED LEADER CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {AUTORIDADES_PRINCIPALES.map((autoridad, index) => (
              <Reveal key={autoridad.cargo} delay={index * 100} className="h-full">
                <div className="h-full bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_10px_30px_rgba(18,23,74,0.04)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary"></div>
                  <div className="flex items-center gap-5">
                    <Avatar name={autoridad.name} size="lg" />
                    <div>
                      <span className="text-[10px] font-bold text-secondary tracking-widest uppercase block mb-2">{autoridad.cargo}</span>
                      <h3 className="text-2xl font-serif font-bold text-primary">{autoridad.name}</h3>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-gray-400">
                    Directorio Ejecutivo • 2026 - 2028
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* MAIN OFFICERS ROW (4 Columns Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {OFICIALES.map((oficial, index) => (
              <PersonCard key={oficial.cargo} cargo={oficial.cargo} name={oficial.name} delay={index * 80} />
            ))}
          </div>

          {/* SECRETARIOS DE PRENSA */}
          <div className="border-t border-slate-200 pt-16 mb-16">
            <h3 className="text-xl font-serif text-primary text-center font-bold mb-10 tracking-wide uppercase">Secretarios de Prensa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {SECRETARIOS_PRENSA.map((item, index) => (
                <PersonCard key={item.name} cargo="Secretario/a de Prensa" name={item.name} delay={index * 80}>
                  <a
                    href={`tel:${item.telefono}`}
                    className="mt-2 text-xs text-secondary font-semibold hover:underline inline-block"
                  >
                    Tel. {item.telefono}
                  </a>
                </PersonCard>
              ))}
            </div>
          </div>

          {/* VOCALES / DIRECTORES GRID */}
          <div className="border-t border-slate-200 pt-16">
            <h3 className="text-xl font-serif text-primary text-center font-bold mb-10 tracking-wide uppercase">Directores Vocales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {DIRECTORES_VOCALES.map((item, index) => (
                <PersonCard key={item.name} cargo={item.cargo} name={item.name} delay={(index % 4) * 80} />
              ))}
            </div>
          </div>

          {/* DELEGADOS */}
          <div className="border-t border-slate-200 pt-16 mt-16">
            <h3 className="text-xl font-serif text-primary text-center font-bold mb-10 tracking-wide uppercase">Delegados Departamentales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {DELEGADOS.map((item, index) => (
                <PersonCard key={item.cargo} cargo={item.cargo} name={item.name} delay={index * 80} />
              ))}
            </div>
          </div>

          {/* INSPECCIÓN Y RECAUDACIÓN */}
          <div className="border-t border-slate-200 pt-16 mt-16">
            <h3 className="text-xl font-serif text-primary text-center font-bold mb-10 tracking-wide uppercase">
              Inspección y Recaudación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {INSPECCION_RECAUDACION.map((name, index) => (
                <PersonCard key={name} cargo="Inspección y Recaudación" name={name} delay={index * 80} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. TRIBUNAL DE ETICA SECTION */}
      <section id="tribunal" className="bg-slate-100 py-24 px-6 text-gray-900 border-b border-slate-200/50 scroll-mt-28 md:scroll-mt-36 2xl:scroll-mt-40">
        <div className="container mx-auto max-w-5xl">
          
          <SectionHeading eyebrow="Tribunal" title="Tribunal de Ética" />

          {/* PRESIDENTE FEATURED */}
          <Reveal className="bg-white border border-slate-200 rounded-2xl py-8 px-6 max-w-xl mx-auto mb-12 text-center shadow-[0_10px_30px_rgba(18,23,74,0.04)] border-t-4 border-t-primary">
            <div className="flex justify-center mb-4">
              <Avatar name={TRIBUNAL_ETICA.presidente} size="lg" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">Presidente del Tribunal</span>
            <h3 className="text-2xl font-serif font-bold text-primary mb-2">{TRIBUNAL_ETICA.presidente}</h3>
            <p className="text-xs italic text-gray-500 font-lato max-w-xs mx-auto">“Ejercicio ético y responsable en la defensa y decoro de la abogacía.”</p>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1">Secretaria del Tribunal</span>
              <h4 className="text-lg font-serif font-bold text-primary">{TRIBUNAL_ETICA.secretaria}</h4>
            </div>
          </Reveal>

          {/* TITULARES & SUPLENTES WRAPPED IN A PREMIUM WHITE CONTAINER CARD */}
          <Reveal className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* MIEMBROS TITULARES */}
              <div>
                <h3 className="text-lg font-serif font-bold text-primary mb-6 pb-2 border-b border-slate-100 uppercase tracking-wider text-center md:text-left">
                  Miembros Titulares
                </h3>
                <div className="space-y-4">
                  {TRIBUNAL_ETICA.titulares.map((nombre) => (
                    <div key={nombre} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-[15px] font-semibold text-gray-700">{nombre}</span>
                      <span className="text-[10px] text-secondary bg-secondary/5 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">Titular</span>
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
                  {TRIBUNAL_ETICA.suplentes.map((nombre) => (
                    <div key={nombre} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-[15px] font-medium text-gray-600">{nombre}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">Suplente</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Reveal>

        </div>
      </section>

      {/* 5. COMISIONES E INSTITUTOS SECTION (DARK, MODERN MINIMALIST CARDS) */}
      <section id="comisiones" className="bg-[#0A0F2C] py-24 px-6 scroll-mt-28 md:scroll-mt-36 2xl:scroll-mt-40">
        <div className="container mx-auto text-center">
          
          <SectionHeading eyebrow="Comunidades" title="Comisiones e Institutos" dark />

          {/* Coordinador */}
          <Reveal className="bg-[#151A39]/80 border border-white/10 rounded-2xl py-8 px-6 max-w-xl mx-auto mb-10 text-center shadow-lg border-t-4 border-t-secondary">
            <span className="text-[10px] font-bold text-secondary tracking-wider uppercase block mb-2">
              {COORDINADOR_COMISIONES.role}
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              {COORDINADOR_COMISIONES.name}
            </h3>
          </Reveal>

          {/* Reglamento — PDF en public/docs, sin pegar texto */}
          <Reveal className="bg-[#151A39]/60 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-14 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/15 text-secondary mb-4">
              <FaFilePdf className="text-xl" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              Reglamento de Institutos y Comisiones
            </h3>
            <p className="text-sm text-slate-400 font-light mb-6 max-w-md mx-auto leading-relaxed">
              Normativa de la 2.ª Circunscripción Judicial de Mendoza. Podés consultarlo en línea o descargarlo en PDF.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={REGLAMENTO_INSTITUTOS_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-secondary/90 transition-all duration-300 shadow-[0_4px_15px_rgba(40,47,136,0.3)]"
              >
                <FaFilePdf />
                Ver reglamento
              </a>
              <a
                href={REGLAMENTO_INSTITUTOS_PDF}
                download="Reglamento-Institutos-Comisiones-2da-Circ-MZA.pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 border border-white/20 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Descargar PDF
              </a>
            </div>
          </Reveal>

          {/* Filtros */}
          <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div role="group" aria-label="Filtrar por tipo" className="inline-flex self-center md:self-auto bg-white/5 border border-white/10 rounded-full p-1">
              {FILTROS_COMISIONES.map((filtro) => (
                <button
                  key={filtro.id}
                  type="button"
                  onClick={() => setFiltroComisiones(filtro.id)}
                  aria-pressed={filtroComisiones === filtro.id}
                  className={`rounded-full px-4 py-2 text-xs md:text-sm font-semibold transition-colors duration-300 ${
                    filtroComisiones === filtro.id
                      ? "bg-secondary text-white shadow-[0_4px_15px_rgba(40,47,136,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {filtro.label}
                  <span className="ml-1.5 text-[10px] opacity-70">{conteoPorTipo[filtro.id]}</span>
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="search"
                value={busquedaComisiones}
                onChange={(event) => setBusquedaComisiones(event.target.value)}
                placeholder="Buscar por nombre o integrante"
                aria-label="Buscar comisiones e institutos"
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:bg-white/10 transition-colors"
              />
              {busquedaComisiones && (
                <button
                  type="button"
                  onClick={() => setBusquedaComisiones("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {comisionesFiltradas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {comisionesFiltradas.map((item, i) => {
                const esInstituto = tipoDeComision(item) === "instituto";
                return (
                  <Reveal key={item.title} delay={(i % 4) * 70} className="h-full">
                    <div className="group h-full bg-[#151A39]/60 hover:bg-[#1C234E] rounded-2xl p-6 text-center border-t-2 border-primary/20 hover:border-t-secondary hover:-translate-y-1 transition-all duration-300 shadow-sm flex flex-col justify-center min-h-[180px] border border-white/[0.02]">
                      <span
                        className={`self-center mb-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          esInstituto ? "bg-white/10 text-slate-300" : "bg-indigo-400/15 text-indigo-200"
                        }`}
                      >
                        {esInstituto ? "Instituto" : "Comisión"}
                      </span>
                      <h3 className="text-base font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors duration-300">
                        {item.title}
                      </h3>
                      {item.presidente && (
                        <p className="text-xs text-slate-300 font-lato leading-relaxed">
                          <span className="text-indigo-300/80 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">
                            Presidente
                          </span>
                          {item.presidente}
                        </p>
                      )}
                      {item.secretaria && (
                        <p className="text-xs text-slate-400 font-lato leading-relaxed mt-2">
                          <span className="text-indigo-300/80 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">
                            Secretaria/o
                          </span>
                          {item.secretaria}
                        </p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="max-w-md mx-auto py-12 text-slate-400">
              <p className="text-sm">
                No encontramos comisiones ni institutos para “{busquedaComisiones}”.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBusquedaComisiones("");
                  setFiltroComisiones("todos");
                }}
                className="mt-4 text-sm font-semibold text-white underline underline-offset-4 hover:text-indigo-200"
              >
                Ver todas
              </button>
            </div>
          )}
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
            {INTEREST_LINKS.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
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
