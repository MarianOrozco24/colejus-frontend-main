import React, { useState, useEffect } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import { FaRegClock, FaSearch } from "react-icons/fa";
import Footer from "../components/Footer";
import { fetchAllNews } from "../api/news/fetchAllNews";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ uuid, title, description, readTime, tags, subtitle }) => {
  const navigate = useNavigate();

  const handleRead = () => {
    navigate(`/noticias/${uuid}`);
  };

  return (
  <div className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow mb-8">
      <div className="p-4">
        <div className="mb-3">
          {tags.map((item, index) => (
            <span
              key={index}
              className="bg-[#3B3DA8] text-white text-xs px-2 mx-1 py-0.5 rounded-full"
            >
              {item.name}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-medium mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{subtitle}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm flex items-center gap-1">
            <FaRegClock className="text-xs" /> {readTime}m
          </span>
          <button
            onClick={handleRead}
            className="text-[#3B3DA8] hover:text-[#2F307F] text-sm font-medium font-lato"
          >
            Leer
          </button>
        </div>
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
        const response = await fetchAllNews();
        if (response.status === 200) {
          const fetchedNews = response.data.news;
          setAllNews(fetchedNews);

          const total = Math.ceil(fetchedNews.length / ITEMS_PER_PAGE);
          setTotalPages(total);

          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          const end = start + ITEMS_PER_PAGE;
          setNews(fetchedNews.slice(start, end));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Error al cargar las noticias");
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
      <header className="relative h-[65vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div
          className="absolute inset-0 opacity-60 z-0"
          style={{ backgroundColor: "#06092E" }}
        ></div>

        <ResponsiveNav />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4 pt-40 md:pt-0">
          <h1
            className="2xl:text-7xl md:text-5xl font-normal mb-2"
            style={{ lineHeight: "1.5" }}
          >
            Mantenete actualizado
          </h1>
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
                description={item.description}
                readTime={item.reading_duration}
                tags={item.tags}
                subtitle={item.subtitle}
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
