import React, { useEffect, useState } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import Footer from "../components/Footer";
import CourtCarousel from "../components/CourtCarousel";
import derecho_ambiental from "../assets/derecho-ambiental.png";
import derecho_comercial from "../assets/derecho-comercial.png";
import derecho_consumo from "../assets/derecho-consumo.png";
import derecho_familia from "../assets/derecho-familia.png";
import derecho_laboral from "../assets/derecho-laboral.png";
import derecho_penal from "../assets/derecho-penal.png";
import comision_cultura from "../assets/comision-cultura.png";
import comision_genero from "../assets/comision-genero.png";
import comision_jovenes from "../assets/comision-jovenes.png";
import comision_senior from "../assets/comision-senior.png";
import { useIntegrantes } from "../api/integrantes/integrantes";

const Nosotros = () => {
  const token = localStorage.getItem("authToken");

  const {
    integrantes,
    loading,
    fetchIntegrantes,
    agregarIntegrante,
    eliminarIntegrante,
  } = useIntegrantes(token);

  const renderIntegrantesPorCategoria = (categoria) =>
    integrantes.filter((i) => i.categoria === categoria);

  const baseInfo = {
    name: "Dra. Rocío Rodríguez",
    position: "Vocal suplente",
    tuition: "25195",
  };

  const agruparPorCargo = (integrantes) => {
    const agrupados = {};
    integrantes.forEach((i) => {
      if (!agrupados[i.cargo]) {
        agrupados[i.cargo] = [];
      }
      agrupados[i.cargo].push(i);
    });
    return agrupados;
  };

  const generateArray = (baseObject, count) => {
    return Array.from({ length: count }, () => ({ ...baseObject }));
  };

  const partners = generateArray(baseInfo, 12);
  const court = generateArray(baseInfo, 12);

  const commissions = [
    {
      src: comision_cultura,
      alt: "Cultura y deporte",
      title: "Cultura y deporte",
    },
    {
      src: derecho_familia,
      alt: "Derecho familiar",
      title: "Derecho familiar",
    },
    {
      src: comision_genero,
      alt: "Genero",
      title: "Género",
    },
    {
      src: comision_jovenes,
      alt: "Jóvenes abogados",
      title: "Jóvenes abogados",
    },
    {
      src: comision_senior,
      alt: "Senior",
      title: "Senior",
    },
  ];


  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative min-h-[90vh] pb-28 bg-primary flex flex-col justify-start items-center text-white overflow-hidden">
        {/* Fondo oscuro institucional fijo */}
        <div className="absolute inset-0 bg-[#06092E] opacity-95 z-0"></div>

        {/* Navbar visible y encima de todo */}
        <div className="w-full z-20">
          <ResponsiveNav />
        </div>

        {/* Contenido central */}
        <div className="flex flex-col justify-center items-center text-center z-10 px-6 flex-1 mt-16 md:mt-28">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold mb-6 tracking-tight">
            Conocé el Colegio
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl leading-relaxed">
            Te presentamos nuestro Directorio, Tribunal de Ética, Institutos y Comisiones.
            Compromiso, ética y formación al servicio de la profesión.
          </p>
        </div>

        {/* Sección Misión y Visión integrada al fondo azul */}
        <section className="w-full px-6 mt-20 md:px-28">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Misión */}
            <div
              className="bg-white/10 text-white rounded-2xl p-8 shadow-md border-l-4 border-secondary backdrop-blur-sm transition-transform hover:scale-[1.01]"
              data-aos="fade-right"
            >
              <div className="flex items-center mb-4 gap-3">
                <div className="text-secondary text-3xl">🎯</div>
                <h3 className="text-xl font-semibold">Nuestra Misión</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Brindar el mejor servicio a nuestros colegiados y a la comunidad, gestionando con transparencia y representando al Colegio ante otras instituciones.
              </p>
            </div>

            {/* Visión */}
            <div
              className="bg-white/10 text-white rounded-2xl p-8 shadow-md border-l-4 border-secondary backdrop-blur-sm transition-transform hover:scale-[1.01]"
              data-aos="fade-left"
            >
              <div className="flex items-center mb-4 gap-3">
                <div className="text-secondary text-3xl">🚀</div>
                <h3 className="text-xl font-semibold">Nuestra Visión</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Promover el ejercicio ético de la profesión y fomentar el desarrollo profesional de nuestros abogados, impulsando la formación y la actualización constante.
              </p>
            </div>
          </div>
        </section>
      </header>




      <section className="bg-gradient-to-b from-[#f4f6fa] to-[#e9ecf3] py-20 md:py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* ICONO + TÍTULO */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <span className="text-5xl">⚖️</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-primary mb-3">
              Historia
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          {/* TEXTO EN COLUMNA DOBLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-justify leading-relaxed text-gray-700 font-lato">
            <div className="space-y-6">
              <p>
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
              <p>
                Hoy más que nunca, reafirmamos que «no basta que cada abogado sea bueno; es preciso que, juntos, todos los abogados seamos algo».
              </p>
            </div>
          </div>
        </div>
      </section>




      <section id="directorio" className="bg-[#06092E] py-24 px-4 md:px-8 text-white">
        <div className="max-w-6xl mx-auto text-center">

          {/* TÍTULO */}
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Directorio del Colegio
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-16"></div>

          {/* PRESIDENTE */}
          <div className="bg-white/5 shadow rounded-xl py-10 px-6 max-w-xl mx-auto mb-20 border-t-4 border-secondary backdrop-blur-sm">
            <div className="text-5xl mb-4">👨‍⚖️</div>
            <h3 className="text-2xl font-bold text-white tracking-wide mb-1">PRESIDENTE</h3>
            <p className="text-lg text-white/90 font-light mb-2">Dr. Gonzalo Taboas</p>
            <p className="text-sm italic text-white/60">“Por una abogacía ética, comprometida y unida.”</p>
          </div>

          {/* TESORERO Y DIRECTORES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">

            {/* Tesorero */}
            <div className="bg-white/5 border-t-4 border-yellow-500 rounded-xl px-6 py-6 shadow-md hover:shadow-lg transition min-h-[180px] backdrop-blur-sm">
              <div className="text-3xl mb-2">💼</div>
              <h3 className="text-md font-bold text-white tracking-wide mb-1">TESORERO</h3>
              <p className="text-sm text-white/90 font-light">Dr. Luis Jofré</p>
            </div>

            {/* Directores */}
            {[
              'Dr. Ricardo Hernán Albornoz',
              'Dr. Gatica Ricardo',
              'Dr. Silvestre Diego',
              'Dra. Sat Fátima',
              'Dr. Bermués Francisco Samuel',
              'Dra. Ortiz María Agustina',
              'Dr. Díaz Diego Adrián',
            ].map((name, index) => (
              <div
                key={index}
                className="bg-white/5 border-t-4 border-secondary rounded-xl px-6 py-6 shadow-md hover:shadow-lg transition min-h-[180px] flex flex-col justify-start items-start gap-2 backdrop-blur-sm"
              >
                <div className="text-3xl">👥</div>
                <h3 className="text-md font-bold text-white tracking-wide">DIRECTOR</h3>
                <p className="text-sm text-white/90 font-light">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="bg-[#f4f6fa] py-24 px-6 text-gray-900">
        <div className="container mx-auto text-center">

          {/* Título principal */}
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">Tribunal de Ética</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-16"></div>

          {/* PRESIDENTE */}
          <div className="bg-slate-100 shadow rounded-xl py-10 px-6 max-w-xl mx-auto mb-20 border-t-4 border-primary">
            <div className="text-5xl mb-4">👨‍⚖️</div>
            <h3 className="text-2xl font-bold text-primary tracking-wide mb-1">PRESIDENTE</h3>
            <p className="text-lg text-gray-800 font-light">Dr. Horacio Boldrini</p>
            <p className="text-sm italic text-gray-600 mt-2">“Ejercicio ético, defensa de la abogacía.”</p>
          </div>

          {/* TITULARES */}
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-primary mb-10">MIEMBROS TITULARES</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
            {[
              "Dra. Guillén Alida E. N.",
              "Dr. Llorente Ernesto",
              "Dr. Herrera Abalos Jorge",
              "Dr. Juri Sticca Alfredo",
              "Dr. Angriman Juan Marcos",
              "Dra. Masini María Pía"
            ].map((nombre, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6 border-t-4 border-secondary text-left">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="text-md font-bold text-primary mb-1">MIEMBRO TITULAR</h4>
                <p className="text-sm text-gray-800">{nombre}</p>
              </div>
            ))}
          </div>

          {/* SUPLENTES */}
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-primary mb-10">MIEMBROS SUPLENTES</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Dr. Piedecasas Juan Manuel",
              "Dr. Germanó Pablo",
              "Dr. Correa Santiago Tomas",
              "Dr. Fajardo Martin Luis",
              "Dr. Fernandez Tíndaro",
              "Dr. Bondino Miguel Angel",
              "Dr. Andres Adriel"
            ].map((nombre, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6 border-t-4 border-primary text-left">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="text-md font-bold text-primary mb-1">MIEMBRO SUPLENTE</h4>
                <p className="text-sm text-gray-800">{nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="bg-[#0A0F2C] py-24 px-6">
        <div className="container mx-auto text-center">

          {/* Título con barra institucional */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">
              Comisiones e Institutos
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {[
              { icon: comision_jovenes, title: "Comisión de Jóvenes", name: "Dra. Naim Yapur" },
              { icon: comision_senior, title: "Comisión Senior", name: "Dr. Daniel Repullés" },
              { icon: derecho_familia, title: "Instituto de Derecho de Familia", name: "Dra. Pía Masini" },
              { icon: "🏛️", title: "Instituto de Derecho Administrativo", name: "Dr. Daniel Vignoni" },
              { icon: comision_cultura, title: "Comisión de Deporte y Cultura", name: "Dr. Mauricio Luzuriaga" },
              { icon: derecho_laboral, title: "Instituto de Derecho Laboral", name: "Dr. Javier Torres" },
              { icon: derecho_comercial, title: "Instituto de Derecho Comercial", name: "Dra. Alida Guillén" },
              { icon: derecho_ambiental, title: "Instituto de Derecho Ambiental", name: "Dr. Adriano Indiveri" },
              { icon: derecho_penal, title: "Instituto de Derecho Penal, Procesal Penal y Criminología", name: "Dra. Mariela Herrera" },
              { icon: derecho_consumo, title: "Instituto de Derecho de Consumo", name: "Dra. Cecilia Martínez" },
              { icon: comision_genero, title: "Comisión de Perspectiva de Género e Igualdad", name: "Dra. Celeste Marchetti" },
              { icon: "📜", title: "Instituto de Derecho Constitucional", name: "Dr. Enzo Orosito" },
              { icon: "💛", title: "Comisión de Mediación, Conciliación y Arbitraje", name: "Dra. Laura Rehder" },
              { icon: "📋", title: "Instituto de Seguridad Social", name: "Dra. Bibiana López Olivieri" },
              { icon: "🌄", title: "Comisión de Abogados de General Alvear", name: "Dr. Raúl Gomeza" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#151A39] rounded-xl shadow-md p-6 text-center border-t-4 border-primary hover:shadow-lg transition-shadow duration-300"
              >
                {typeof item.icon === "string" && item.icon.startsWith("data:image") ? (
                  <img src={item.icon} alt={item.title} className="w-16 h-16 mx-auto mb-4 object-contain" />
                ) : typeof item.icon === "string" && item.icon.length <= 4 ? (
                  <div className="text-4xl mb-4">{item.icon}</div>
                ) : (
                  <img src={item.icon} alt={item.title} className="w-16 h-16 mx-auto mb-4 object-contain" />
                )}

                <h3 className="text-base md:text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>






      <section className="bg-gray-100 pt-8 pb-24">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-primary">Links de interés</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
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
                className="flex items-center gap-2 text-sm font-lato text-gray-600 hover:text-primary transition"
              >
                <span className="text-lg">🏛️</span>
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
