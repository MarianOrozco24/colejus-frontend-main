import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllNews } from "../api/news/fetchAllNews";
import { mapNewsItemForCard } from "../utils/newsDisplay";
import {
  MOCK_FEATURED_NEWS,
  MOCK_REST_NEWS,
  shouldPreviewHomeNews,
} from "../utils/mockHomeNews";
import NewsCard from "./NewsCard";
import FeaturedNewsStrip from "./FeaturedNewsStrip";

const REST_LIMIT = 4;

const NewsCarousel = ({ variant = "section" }) => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isHero = variant === "hero";

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const applyMocks = () => {
      if (cancelled) return;
      setFeaturedNews(MOCK_FEATURED_NEWS);
      setNews(MOCK_REST_NEWS.map(mapNewsItemForCard));
      setError(null);
      setLoading(false);
    };

    const loadNews = async () => {
      if (isHero && shouldPreviewHomeNews()) {
        applyMocks();
        return;
      }

      try {
        const [featuredResponse, newsResponse] = await Promise.all([
          fetchAllNews(1, 4, true, {
            featuredOnly: true,
            signal: controller.signal,
          }),
          fetchAllNews(1, REST_LIMIT, true, {
            excludeFeatured: true,
            signal: controller.signal,
          }),
        ]);

        if (cancelled || featuredResponse.aborted || newsResponse.aborted) {
          return;
        }

        const featuredOk = featuredResponse.status === 200;
        const newsOk = newsResponse.status === 200;

        if (featuredOk) {
          setFeaturedNews((featuredResponse.data.news || []).slice(0, 4));
        }

        if (newsOk) {
          const featuredIds = new Set(
            (featuredResponse.data?.news || []).map((item) => item.uuid)
          );
          const items = (newsResponse.data.news || []).filter(
            (item) => !item.is_featured && !featuredIds.has(item.uuid)
          );
          setNews(items.slice(0, REST_LIMIT).map(mapNewsItemForCard));
        }

        const hasAny =
          (featuredOk && (featuredResponse.data.news || []).length > 0) ||
          (newsOk && (newsResponse.data.news || []).length > 0);

        if (isHero && process.env.NODE_ENV === "development" && !hasAny) {
          applyMocks();
          return;
        }

        if (!featuredOk && !newsOk) {
          setError("No se pudieron cargar las novedades.");
        }
      } catch (err) {
        if (err?.name === "AbortError" || cancelled) return;
        console.error("Error al cargar novedades", err);
        if (isHero && process.env.NODE_ENV === "development") {
          applyMocks();
          return;
        }
        setError("No se pudieron cargar las novedades.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadNews();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isHero]);

  const hasContent = featuredNews.length > 0 || news.length > 0;

  return (
    <section className="bg-slate-50 py-10 md:py-12 px-4 border-y border-slate-200/70">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] block mb-2">
            Actualidad
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-primary tracking-tight mb-2">
            Novedades del Colegio
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto font-lato">
            Actividades, comunicaciones y noticias institucionales para la
            matrícula.
          </p>
        </div>

        {loading ? (
          <div className="h-24 flex flex-col justify-center items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
            <p className="font-lato text-sm text-gray-500">
              Cargando novedades...
            </p>
          </div>
        ) : error ? (
          <p className="py-6 text-center text-red-600">{error}</p>
        ) : !hasContent ? (
          <p className="py-6 text-center text-gray-500">
            Próximamente publicaremos novedades aquí.
          </p>
        ) : (
          <>
            {featuredNews.length > 0 && (
              <FeaturedNewsStrip
                items={featuredNews}
                variant="home"
                layout="grid"
              />
            )}

            {news.length > 0 && (
              <div className={featuredNews.length > 0 ? "mt-6" : ""}>
                {featuredNews.length > 0 && (
                  <p className="text-[11px] font-bold text-secondary uppercase tracking-[0.2em] mb-3 text-center">
                    Más novedades
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  {news.map((item) => (
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
                      isFeatured={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-7 text-center">
          <Link
            to="/novedades"
            className="inline-block bg-primary text-white hover:bg-primary/95 shadow-md px-8 py-3 rounded-full font-bold transition-all hover:scale-[1.02] text-sm"
          >
            Ver todas las novedades →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsCarousel;
