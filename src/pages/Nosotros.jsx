import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
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

  //MockData
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

  // Function to repeat the base object 12 times
  const generateArray = (baseObject, count) => {
    return Array.from({ length: count }, () => ({ ...baseObject }));
  };

  // Create an array of 12 objects
  const partners = generateArray(baseInfo, 12);

  const court = generateArray(baseInfo, 12);

  //Comisiones
  const commissions = [
    {
      src: comision_cultura, // Image import or URL
      alt: "Cultura y deporte",
      title: "Cultura y deporte",
    },
    {
      src: derecho_familia, // Image import or URL
      alt: "Derecho familiar",
      title: "Derecho familiar",
    },
    {
      src: comision_genero, // Image import or URL
      alt: "Genero",
      title: "Género",
    },
    {
      src: comision_jovenes, // Image import or URL
      alt: "Jóvenes abogados",
      title: "Jóvenes abogados",
    },
    {
      src: comision_senior, // Image import or URL
      alt: "Senior",
      title: "Senior",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative 2xl:h-[65vh] md:h-[80vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div
          className="absolute inset-0 opacity-60 z-0"
          style={{ backgroundColor: "#06092E" }}
        ></div>

        <NavBar />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4">
          <h1
            className="2xl:text-7xl md:text-5xl font-normal mb-6"
            style={{ lineHeight: "1.5" }}
          >
            Quiénes somos
          </h1>
          <h5
            className="2xl:text-2xl md:text-xl font-normal mb-2"
            style={{ lineHeight: "1.5" }}
          >
            Conocé nuestro directorio, tribunal de ética, institutos y
            comisiones.
          </h5>
        </div>
      </header>

      <section className="mt-24 pb-24">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
            <div className="flex flex-col text-start">
              <p className="text-base font-lato font-normal mb-4 text-primary">
                En el Colegio, nos esforzamos por brindar el mejor servicio a
                nuestros colegiados y a la comunidad. Nuestro Directorio,
                elegido democráticamente por todos los miembros, trabaja con
                dedicación para:
              </p>
              <p className="text-base font-lato font-normal mb-4 text-primary">
                Gestionar el Colegio de forma transparente y eficiente. Esto
                incluye la administración de recursos, el cumplimiento de las
                normativas y la representación del Colegio ante otras
                instituciones.
              </p>
            </div>
            <div className="flex flex-col text-start">
              <p className="text-base font-lato font-normal mb-4 text-primary">
                Promover el ejercicio ético de la profesión. Velamos por el
                cumplimiento del Código de Ética y trabajamos para que la
                justicia sea accesible para todos.
              </p>
              <p className="text-base font-lato font-normal mb-4 text-primary">
                Fomentar el desarrollo profesional. Impulsamos actividades de
                formación y actualización para que nuestros colegiados estén
                siempre a la vanguardia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-8 px-20">
      <div className="container mx-auto text-center">

        {/* DIRECTORIO */}
        <h3 className="text-3xl mb-12 text-primary">
          Integrantes del Directorio del Colegio de Abogados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {Object.entries(
            agruparPorCargo(renderIntegrantesPorCategoria("Autoridades"))
          ).map(([cargo, personas]) => (
            <div
              key={cargo}
              className="bg-white p-6 rounded-lg shadow text-center"
            >
              <h4
                className={`text-lg font-semibold mb-2 ${
                  cargo === "Presidente" ? "text-secondary text-xl" : "text-primary"
                }`}
              >
                {cargo}
              </h4>
              <div className="flex flex-col gap-1">
                {personas.map((p) => (
                  <p key={p.uuid} className="text-sm text-gray-700">
                    {p.nombre}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* INSTITUTOS Y COMISIONES */}
        <h3 className="text-3xl mb-12 text-primary">Institutos y Comisiones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {renderIntegrantesPorCategoria("Integrantes").map((i) => (
            <div
              key={i.uuid}
              className="bg-white p-6 rounded-lg shadow text-center flex flex-col items-center"
            >
              <h4 className="text-base font-semibold text-primary mb-1">
                {i.nombre}
              </h4>
              <p className="text-sm text-gray-700 text-center">
                {i.cargo}
                {i.telefono && <span> | Tel. {i.telefono}</span>}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>

      <section className="bg-gray-100 py-8">
        <div className="container mx-auto w-full pb-5">
          <div
            className="bg-primary text-white rounded-lg shadow-lg px-24 py-8 text-center w-full"
            style={{
              background: "#12174A",
            }}
          >
            <h2 className="font-normal text-4xl md:text-3xl mb-12 mt-8">
              Tribunal de ética
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-28 justify-center items-center mb-10">
              <div className="flex flex-col text-start">
                <p className="text-base font-lato font-normal mb-4 text-white">
                  De acuerdo a lo establecido por la Ley 4976 en su artículo 44,
                  el conocimiento y decisión de las causas relativas al orden
                  disciplinario esta a cargo del Tribunal de Ética, que tiene
                  competencia en primera instancia (la Federación de Colegios de
                  Abogados y Procuradores de la Provincia en Segunda instancia y
                  la Suprema Corte de Justicia que actuará como órgano de última
                  instancia).
                </p>
                <p className="text-base font-lato font-normal mb-4 text-white">
                  Por lo tanto, es el Tribunal de Ética el que tiene la difícil
                  pero trascendental tarea de sancionar a los Abogados y
                  Procuradores que no han actuado de acuerdo con las normas del
                  Código de Ética.
                </p>
              </div>
              <div className="flex flex-col text-start">
                <p className="text-base font-lato font-normal mb-4 text-white">
                  El Tribunal de Ética está conformado por siete miembros y
                  siete suplentes, quienes eligen de su seno un presidente y un
                  vicepresidente. Son elegidos en la misma forma que los
                  miembros del Directorio y duran dos años en sus funciones.
                </p>
                <p className="text-base font-lato font-normal mb-4 text-white">
                  Es vital la tarea realizada por este órgano, ya que al cumplir
                  su función, enaltece la profesión mediante la aplicación de
                  las normas que fijan las pautas dentro de las cuales un
                  Abogado o Procurador debe desarrollar su vida profesional,
                  para el bien de la profesión y de sus clientes.
                </p>
              </div>
            </div>
            <div className="mb-10">
              <CourtCarousel
                court={renderIntegrantesPorCategoria("Tribunal de Etica")}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 pb-24">
        <div className="container mx-auto text-center">
          <h2 className="font-normal text-4xl md:text-3xl mb-12 mt-8">
            Historia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
            <div className="flex flex-col text-start">
              <p className="text-base font-lato font-normal mb-4 text-primary">
                Con la sanción de la Ley Provincial 1525 en el año 1942, nació
                en San Rafael – sede de la Segunda Circunscripción Judicial –
                una corriente decidida a fundar un Colegio Público de Abogados y
                Procuradores, tendiente a defender los derechos e intereses de
                la Abogacía organizada. Esta iniciativa se concretó un año más
                tarde, en septiembre de 1943, cuando se funda el Colegio Público
                de Abogados y Procuradores de la Segunda Circunscripción
                Judicial de Mendoza, que nuclea a los profesionales del Derecho
                de San Rafael, General Alvear y Malargüe, y que desde su
                nacimiento participa activamente en todo tipo de actividades y
                gestiones tendientes a lograr un mejor ejercicio de la profesión
                y servicio de Justicia.
              </p>
              <p className="text-base font-lato font-normal mb-4 text-primary">
                La Ley 4976 establece en su artículo 62 que en cada
                Circunscripción Judicial de la Provincia funcionará un Colegio
                de Abogados y Procuradores, que tendrá el carácter, los derechos
                y las obligaciones de las personas de derecho público no
                estatal, a efectos de cumplir con los objetivos de interés
                general que son inherentes a la Abogacía y a la Procuración. Por
                su parte, el artículo 63 expresa que cada Colegio tendrá su
                asiento en la ciudad cabecera de cada Circunscripción Judicial,
                y se denominará y distinguirá con el número que le corresponda a
                la Circunscripción Judicial en donde actúan. En el edificio
                donde se concentre la mayor cantidad de oficinas judiciales,
                deberá concedérseles sin cargo, un ámbito apropiado para el
                funcionamiento del Colegio.
              </p>
            </div>
            <div className="flex flex-col text-start">
              <p className="text-base font-lato font-normal mb-4 text-primary">
                Nuestro Colegio realiza ingentes y constantes esfuerzos
                tendientes al mejoramiento del Servicio de Justicia y al
                progreso de la Legislación, siendo un receloso defensor de la
                observancia de las reglas de ética profesional y de la defensa
                de los derechos de los Abogados y Procuradores en el ejercicio
                de la profesión. Pero también es una Institución abierta a la
                comunidad, que opina y realiza dictámenes, capacitaciones,
                charlas y gestiones que lo destacan como un actor social de
                importante prestigio.
              </p>
              <p className="text-base font-lato font-normal mb-4 text-primary">
                Hoy, el Colegio Público de Abogados y Procuradores de la Segunda
                Circunscripción Judicial de Mendoza está en constante
                crecimiento, con numerosas Comisiones e Institutos que realizan
                capacitaciones y dictámenes constantes, y con una activa y
                reconocida participación en la Federación Mendocina de Colegios
                de Abogados y en la Federación Argentina de Colegios de
                Abogados. Frecuentemente, el Directorio del Colegio realiza
                gestiones ante los tres poderes del Estado, y continuamente se
                está luchando por mejores condiciones para ejercer la profesión
                y para brindar el servicio de Justicia que el ciudadano merece.
              </p>
              <p className="text-base font-lato font-normal mb-4 text-primary">
                Hoy más que nunca, reafirmamos que «no basta que cada abogado
                sea bueno; es preciso que, juntos, todos los abogados seamos
                algo».
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-8 flex items-center justify-center">
        <div className="mx-20 w-full pb-5">
          <div
            className="text-white px-24 py-8 text-center w-full"
            style={{
              background: "rgba(233, 230, 230, 0.50)",
            }}
          >
            <h2 className="font-normal text-4xl md:text-3xl mb-12 mt-8 text-primary">
              Tribunal de ética
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
              {/* Row 1 */}
              <div className="flex flex-col items-center">
                <img
                  src={derecho_ambiental}
                  alt="Derecho ambiental"
                  className="w-44 h-28 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800">
                  Derecho ambiental
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={derecho_familia}
                  alt="Derecho familiar"
                  className="w-44 h-28 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800">
                  Derecho familiar
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={derecho_penal}
                  alt="Derecho penal, procesal penal y criminología"
                  className="w-44 h-28 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800">
                  Derecho penal, procesal penal y criminología
                </h3>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={derecho_comercial}
                  alt="Derecho comercial"
                  className="w-44 h-28 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800">
                  Derecho comercial
                </h3>
              </div>

              {/* Row 2 */}
              <div className="col-span-2 flex flex-col items-center justify-center">
                <img
                  src={derecho_consumo}
                  alt="Derecho de consumo"
                  className="w-44 h-28 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800">
                  Derecho de consumo
                </h3>
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center">
                <img
                  src={derecho_laboral}
                  alt="Derecho laboral"
                  className="w-44 h-28 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-800">
                  Derecho laboral
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 pt-8 pb-24 flex items-center justify-center">
        <div className="mx-20 w-full pb-5">
          <div className="text-center w-full">
            {/* Section Title */}
            <h2 className="font-normal text-4xl md:text-3xl mb-12 mt-8 text-primary">
              Comisiones
            </h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-8">
              {commissions.map((commission, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={commission.src}
                    alt={commission.alt}
                    className="w-44 h-28 mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-800">
                    {commission.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 pt-8 pb-24">
        <div className="container mx-auto text-center">
          {/* Links de interés */}
          <div className="flex flex-col items-start">
            <h3 className="text-2xl font-semibold mb-8 text-primary">
              Links de interés
            </h3>
            <div className="grid grid-cols-5 gap-8 w-full">
              <a
                href="#poder-judicial-mza"
                className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
              >
                Poder judicial Mza
              </a>
              <a
                href="#listas-diarias"
                className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
              >
                Listas diarias
              </a>
              <a
                href="#notificaciones"
                className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
              >
                Notificaciones
              </a>
              <a
                href="#atm"
                className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
              >
                ATM
              </a>
              <a
                href="#faca"
                className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
              >
                FACA
              </a>
              <a
                href="#tasas-judiciales"
                className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
              >
                Tasas Judiciales
              </a>
              <a
                href="#caja-forense"
                className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
              >
                Caja Forense
              </a>
              <a
                href="#valor-jus"
                className="font-lato text-base text-gray-700 hover:text-primary border-b border-gray-300 hover:border-primary"
              >
                Valor de JUS
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Nosotros;
