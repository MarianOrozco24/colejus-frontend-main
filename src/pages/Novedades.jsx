import React, { useState, useEffect } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import { FaRegClock } from "react-icons/fa";
import Footer from "../components/Footer";
import { fetchAllNews } from "../api/news/fetchAllNews";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ uuid, title, subtitle, readTime, tags, image, link }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 mb-8 flex flex-col justify-between h-[450px]">
      <div>
        <div className="relative h-44 overflow-hidden bg-slate-200">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 max-w-[150px] truncate">
            {tags.map((item, index) => (
              <span
                key={index}
                className="bg-[#06092E] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm uppercase"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-3 leading-snug mb-2 hover:text-primary transition-colors" title={title}>
            {title}
          </h3>
          <p className="text-gray-500 text-xs font-lato line-clamp-3 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      <div className="p-5 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-gray-400 text-[10px] font-semibold flex items-center gap-1">
          <FaRegClock className="text-xs" /> {readTime}m
        </span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1"
        >
          Leer artículo <span>↗</span>
        </a>
      </div>
    </div>
  );
};

const Novedades = () => {
  const [allNews, setAllNews] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 8;

  // Carga inicial
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        // Feed jurídico de Microjuris Argentina (no el de Puerto Rico)
        const rssUrl = "https://aldiaargentina.microjuris.com/feed/";
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        
        if (data.status === "ok" && data.items) {
          const formattedNews = data.items.map((item, index) => {
            // Limpiar etiquetas de HTML
            const cleanDesc = item.description 
              ? item.description.replace(/<[^>]*>?/gm, '').trim() 
              : '';

            // Obtener categoría del feed
            const cat = item.categories && item.categories.length > 0
              ? item.categories[0].charAt(0).toUpperCase() + item.categories[0].slice(1)
              : "Doctrina";

            // Fallbacks de imágenes premium
            const fallbacks = ["/image-1.jpeg", "/image-2.jpeg", "/image-5.jpeg", "/carousel-image.jpeg"];
            const img = item.thumbnail || item.enclosure?.link || fallbacks[index % fallbacks.length];

            return {
              uuid: item.guid || index,
              title: item.title,
              subtitle: cleanDesc,
              reading_duration: 3, // Tiempo estándar estimado
              tags: [{ name: cat }],
              image: img,
              link: item.link
            };
          });

          setAllNews(formattedNews);

          const total = Math.ceil(formattedNews.length / ITEMS_PER_PAGE);
          setTotalPages(total);

          const start = 0;
          const end = ITEMS_PER_PAGE;
          setNews(formattedNews.slice(start, end));
        } else {
          setError("No se pudo obtener el canal de novedades.");
        }
      } catch (err) {
        setError("Error al cargar las noticias del ámbito jurídico.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  // Cambio de página
  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setNews(allNews.slice(start, end));
  }, [currentPage, allNews]);

  // Validación de página fuera de rango
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative min-h-[50vh] pb-16 bg-[#06092E] flex flex-col justify-start items-center text-white text-center overflow-hidden">
        {/* Fondo con degradado elegante a juego con Nosotros */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06092E] via-[#080c3e] to-[#040620] z-0"></div>

        {/* Navbar */}
        <div className="w-full z-20">
          <ResponsiveNav />
        </div>

        {/* Contenido principal del título */}
        <div className="flex flex-col justify-center items-center text-center z-10 px-6 flex-1 mt-28 md:mt-36">
          <h1
            className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight"
            style={{ lineHeight: "1.2" }}
          >
            Mantenete actualizado
          </h1>
          <p className="text-slate-300 font-light max-w-2xl text-sm md:text-base font-lato leading-relaxed">
            Enterate de los últimos fallos jurisprudenciales, novedades normativas y doctrina legal de interés profesional en tiempo real.
          </p>
        </div>
      </header>

      <section className="min-h-full bg-gray-100 px-4 md:px-0 2xl:mx-52 md:mx-16 mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.length === 0 ? (
            <p>Aún no hay noticias.</p>
          ) : (
            news.map((item, index) => (
              <NewsCard
                key={index}
                uuid={item.uuid}
                title={item.title}
                subtitle={item.subtitle}
                readTime={item.reading_duration}
                tags={item.tags}
                image={item.image}
                link={item.link}
              />
            ))
          )}
        </div>


        {/* Paginación */}
        {news.length > 0 && totalPages > 1 && (
          <div className="flex justify-between items-center mt-8 mb-16">
            {/* Anterior */}
            <button
              className={`px-4 py-2 rounded-md border border-primary text-primary font-bold transition ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary hover:text-white"
              }`}
              onClick={() => {
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>

            {/* Indicador */}
            <span className="text-primary font-bold">
              Página{" "}
              <span className="px-2 border rounded-md">{currentPage}</span> de{" "}
              {totalPages}
            </span>

            {/* Siguiente */}
            <button
              className={`px-4 py-2 rounded-md border border-primary text-primary font-bold transition ${
                currentPage >= totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary hover:text-white"
              }`}
              onClick={() => {
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
              disabled={currentPage >= totalPages}
            >
              Siguiente →
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Novedades;
