import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomeCarousel from "../components/HomeCarousel";
import MobileHomeCarousel from "../components/MobileHomeCarousel";
import MobileFooter from "../components/MobileFooter";
import NewsCarousel from "../components/NewsCarousel";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      {/* HomeCarousel: Only for desktop (md and above) */}
      <div className="hidden md:block">
        <HomeCarousel />
      </div>
      <div className="hidden md:block">
        <NewsCarousel />
      </div>

      {/* New mobile carousel: Only for mobile (below md) */}
      <div className="block md:hidden">
        <MobileHomeCarousel />
      </div>

      <section className="bg-white py-10 md:py-20 md:mx-0 mx-3">
        <div className="container mx-auto w-full md:w-3/4 bg-primary rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden mx-4">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-around items-end">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white block md:hidden ml-8">
              Nosotros
            </h1>
            <img src="/isologo.svg" alt="Isologo" className="w-24 h-24 mt-4" />
          </div>

          {/* Left content section */}
          <div className="p-6 md:w-1/2 md:p-32 relative">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white hidden md:block">
              Nosotros
            </h1>
            <p
              className="text-gray-200 mb-4 text-sm md:text-base"
              style={{ fontFamily: "Lato" }}
            >
              El Directorio del Colegio es el órgano de administración y de
              ejecución de las decisiones de Asamblea, así como de las gestiones
              diarias y corrientes de la Institución.
            </p>
            <p
              className="text-gray-200 mb-4 text-sm md:text-base"
              style={{ fontFamily: "Lato" }}
            >
              Al igual que el Tribunal de Ética, y tal cual lo establece el
              artículo 76 de la Ley 4976, se integra con miembros elegidos a
              través del voto directo y secreto, y duran dos años en sus
              funciones. Se compone de un presidente, siete miembros titulares y
              tres suplentes.
            </p>
            <a
              href="#nosotros"
              className="text-white border border-white px-4 py-2 rounded-full inline-block mt-4"
              style={{ fontFamily: "Lato" }}
            >
              Conocé más
            </a>

            {/* Desktop background logo */}
            <div className="absolute hidden md:block right-0 bottom-0 opacity-10">
              <img
                src="/isologo.svg"
                alt="Background Isologo"
                className="w-32 h-32"
              />
            </div>
          </div>

          {/* Right image section (visible on desktop only) */}
          <div className="hidden md:block md:w-1/2">
            <img
              src="/image-2.jpeg"
              alt="Nosotros"
              className="w-full h-auto object-cover"
              style={{
                minHeight: "100%",
                maxHeight: "100%",
                borderRadius: "0px 16px 16px 0px",
              }}
            />
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
