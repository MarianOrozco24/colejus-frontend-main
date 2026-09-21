import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllNews } from "../api/news/fetchAllNews";
import { mapNewsItemForCard } from "../utils/newsDisplay";
import NewsCard from "./NewsCard";
import FeaturedNewsStrip from "./FeaturedNewsStrip";

const NewsCarousel = ({ variant = "section" }) => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isHero = variant === "hero";
  const listLimit = isHero ? 4 : 8;

  useEffect(() => {
    const loadNews = async () => {
      try {
        const [featuredResponse, newsResponse] = await Promise.all([
          fetchAllNews(1, 8, true, { featuredOnly: true }),
          fetchAllNews(1, listLimit, true, { excludeFeatured: true }),
        ]);

        const featuredOk = featuredResponse.status === 200;
        const newsOk = newsResponse.status === 200;

        if (featuredOk) {
          setFeaturedNews(featuredResponse.data.news || []);
        }

        if (newsOk) {
          const featuredIds = new Set(
            (featuredResponse.data?.news || []).map((item) => item.uuid)
          );
          const items = (newsResponse.data.news || []).filter(
            (item) => !item.is_featured && !featuredIds.has(item.uuid)
          );
          setNews(items.slice(0, listLimit).map(mapNewsItemForCard));
        }

        if (!featuredOk && !newsOk) {
          setError("No se pudieron cargar las novedades.");
        }
      } catch (err) {
        console.error("Error al cargar novedades", err);
        setError("No se pudieron cargar las novedades.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [listLimit]);

  const content = (
    <>
      <h2
        className={`font-serif font-semibold tracking-tight mb-2 ${
          isHero
            ? "text-3xl md:text-5xl text-white"
            : "text-4xl md:text-5xl text-primary"
        }`}
      >
        Novedades del Colegio
      </h2>
      <p
        className={`max-w-2xl mx-auto mb-8 md:mb-10 font-lato ${
          isHero
            ? "text-sm md:text-base text-slate-300 leading-relaxed"
            : "text-base md:text-lg text-gray-600"
        }`}
      >
        Actividades, comunicaciones y noticias institucionales para la
        matrícula.
      </p>

      {loading ? (
        <div className="h-40 md:h-52 flex flex-col justify-center items-center gap-3">
          <div
            className={`animate-spin rounded-full h-10 w-10 border-t-2 ${
              isHero ? "border-white" : "border-primary"
            }`}
          ></div>
          <p
            className={`font-lato text-sm ${
              isHero ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Cargando novedades...
          </p>
        </div>
      ) : error ? (
        <p
          className={`py-8 ${
            isHero ? "text-slate-300" : "text-red-600"
          }`}
        >
          {error}
        </p>
      ) : (
        <>
          <FeaturedNewsStrip
            items={featuredNews}
            variant="home"
            tone={isHero ? "dark" : "light"}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left max-w-5xl mx-auto">
            {news.length === 0 && featuredNews.length === 0 ? (
              <p
                className={`col-span-full text-center ${
                  isHero ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Próximamente publicaremos novedades aquí.
              </p>
            ) : (
              news.map((item) => (
                <NewsCard
                  key={item.uuid}
                  variant={isHero ? "hero" : "home"}
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
        </>
      )}

      <div className="mt-10 md:mt-12">
        <Link
          to="/novedades"
          className={`inline-block shadow-md px-8 py-3 rounded-full font-bold transition-all transform hover:scale-[1.02] text-sm ${
            isHero
              ? "bg-white text-primary hover:bg-slate-100"
              : "bg-primary text-white hover:bg-primary/95"
          }`}
        >
          Ver todas las novedades →
        </Link>
      </div>
    </>
  );

  if (isHero) {
    return (
      <section
        className="rounded-2xl shadow-2xl p-6 md:p-10 text-center w-full border border-white/10"
        style={{
          background: "linear-gradient(135deg, #1A1F66 0%, #06092E 100%)",
        }}
      >
        {content}
      </section>
    );
  }

  return (
    <section className="bg-white py-24 px-4">
      <div className="container mx-auto max-w-6xl text-center">{content}</div>
    </section>
  );
};

export default NewsCarousel;
