import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRegClock, FaRegCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { fetchNewsById } from "../api/news/fetchNewsById";
import ResponsiveNav from "../components/ResponsiveNav";
import Footer from "../components/Footer";
import { formatNewsDate, getNewsCoverImage } from "../utils/newsDisplay";

const VerNoticia = () => {
  const { uuid } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNewsItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchNewsById(uuid);
        if (response.status === 200) {
          setNewsItem(response.data);
        } else {
          setError("No se pudo cargar la noticia.");
        }
      } catch {
        setError("Error al cargar la noticia.");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      loadNewsItem();
    }
  }, [uuid]);

  const coverImage = newsItem
    ? getNewsCoverImage(newsItem.image_path)
    : "/carousel-image.jpeg";

  const tags =
    newsItem && Array.isArray(newsItem.tags) && newsItem.tags.length > 0
      ? newsItem.tags
      : [];

  return (
    <div className="bg-white min-h-screen">
      <header className="relative min-h-[60vh] md:h-[65vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center overflow-hidden">
        <img
          src={coverImage}
          alt={newsItem?.title || "Novedad"}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 opacity-60 z-0 bg-[#06092E]"></div>
        <ResponsiveNav />
        {!loading && !error && newsItem && (
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-4 pt-40 md:pt-0 text-white">
            {tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full uppercase"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-4xl">
              {newsItem.title}
            </h1>
            {newsItem.subtitle && (
              <h2 className="text-lg md:text-xl text-slate-200 max-w-3xl">
                {newsItem.subtitle}
              </h2>
            )}
          </div>
        )}
      </header>

      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          to="/novedades"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary font-semibold text-sm mb-8 transition-colors"
        >
          <FaArrowLeft /> Volver a novedades
        </Link>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 py-12">{error}</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-slate-100">
              {newsItem.date && (
                <span className="flex items-center gap-2">
                  <FaRegCalendarAlt />
                  {formatNewsDate(newsItem.date)}
                </span>
              )}
              {newsItem.reading_duration && (
                <span className="flex items-center gap-2">
                  <FaRegClock />
                  {newsItem.reading_duration} min de lectura
                </span>
              )}
            </div>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default VerNoticia;
