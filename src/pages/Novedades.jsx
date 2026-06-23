import React, { useState, useEffect } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import FeaturedNewsStrip from "../components/FeaturedNewsStrip";
import { fetchAllNews } from "../api/news/fetchAllNews";
import { mapNewsItemForCard } from "../utils/newsDisplay";

const Novedades = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await fetchAllNews(1, 8, true, { featuredOnly: true });
        if (response.status === 200) {
          const items = response.data.news || [];
          setFeaturedNews(items);
        }
      } catch {
        setFeaturedNews([]);
      }
    };

    loadFeatured();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAllNews(currentPage, ITEMS_PER_PAGE, true);

        if (response.status === 200) {
          const { news: items = [], pages = 1 } = response.data;
          setNews(items.map(mapNewsItemForCard));
          setTotalPages(Math.max(pages, 1));
        } else {
          setError("No se pudieron cargar las novedades.");
        }
      } catch {
        setError("Error al cargar las novedades.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [currentPage]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative min-h-[50vh] pb-16 bg-[#06092E] flex flex-col justify-start items-center text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#06092E] via-[#080c3e] to-[#040620] z-0"></div>

        <div className="w-full z-20">
          <ResponsiveNav />
        </div>

        <div className="flex flex-col justify-center items-center text-center z-10 px-6 flex-1 mt-28 md:mt-36">
          <h1
            className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight"
            style={{ lineHeight: "1.2" }}
          >
            Mantenete actualizado
          </h1>
          <p className="text-slate-300 font-light max-w-2xl text-sm md:text-base font-lato leading-relaxed">
            Enterate de las últimas novedades, actividades y comunicaciones del
            Colegio de Abogados y Procuradores.
          </p>
        </div>
      </header>

      <section className="min-h-full bg-gray-100 px-4 md:px-0 2xl:mx-52 md:mx-16 mt-20">
        <FeaturedNewsStrip items={featuredNews} />

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 py-12">{error}</p>
        ) : (
          <>
            {featuredNews.length > 0 && news.length > 0 && (
              <h3 className="text-2xl font-serif font-semibold text-primary mb-6">
                Todas las novedades
              </h3>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 py-12">
                  Aún no hay novedades publicadas.
                </p>
              ) : (
                news.map((item) => (
                  <NewsCard
                    key={item.uuid}
                    title={item.title}
                    subtitle={item.subtitle}
                    dateLabel={item.dateLabel}
                    readTime={item.reading_duration}
                    tags={item.tags}
                    image={item.image}
                    link={item.link}
                    isFeatured={item.is_featured}
                  />
                ))
              )}
            </div>

            {news.length > 0 && totalPages > 1 && (
              <div className="flex justify-between items-center mt-8 mb-16">
                <button
                  className={`px-4 py-2 rounded-md border border-primary text-primary font-bold transition ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary hover:text-white"
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>

                <span className="text-primary font-bold">
                  Página{" "}
                  <span className="px-2 border rounded-md">{currentPage}</span>{" "}
                  de {totalPages}
                </span>

                <button
                  className={`px-4 py-2 rounded-md border border-primary text-primary font-bold transition ${
                    currentPage >= totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary hover:text-white"
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Novedades;
