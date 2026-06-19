import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllNews } from "../api/news/fetchAllNews";
import { mapNewsItemForCard } from "../utils/newsDisplay";
import NewsCard from "./NewsCard";

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetchAllNews(1, 8, true);

        if (response.status === 200) {
          const items = response.data.news || [];
          setNews(items.map(mapNewsItemForCard));
        }
      } catch (error) {
        console.error("Error al cargar novedades", error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <section className="bg-white py-24 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary tracking-tight mb-2">
          Novedades del Colegio
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-16 font-lato">
          Actividades, comunicaciones y noticias institucionales para la
          matrícula.
        </p>

        {loading ? (
          <div className="h-64 flex flex-col justify-center items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
            <p className="text-gray-500 font-lato text-sm">
              Cargando novedades...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left max-w-5xl mx-auto">
              {news.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">
                  Próximamente publicaremos novedades aquí.
                </p>
              ) : (
                news.map((item) => (
                  <NewsCard
                    key={item.uuid}
                    variant="home"
                    title={item.title}
                    subtitle={item.subtitle}
                    dateLabel={item.dateLabel}
                    readTime={item.reading_duration}
                    tags={item.tags}
                    image={item.image}
                    link={item.link}
                  />
                ))
              )}
            </div>

            {news.length > 0 && (
              <div className="mt-16">
                <Link
                  to="/novedades"
                  className="inline-block bg-primary text-white hover:bg-primary/95 shadow-md px-8 py-3 rounded-full font-bold transition-all transform hover:scale-[1.02] text-sm"
                >
                  Ver todas las novedades →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default NewsCarousel;
