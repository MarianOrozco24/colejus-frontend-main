import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllNews } from "../api/news/fetchAllNews";

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetchAllNews(1);
        if (response.status === 200) {
          setNews(response.data.news.slice(0, 10)); // Mostramos las primeras 10
        }
      } catch (error) {
        console.error("Error al cargar el carrusel de noticias", error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex justify-center items-center">Cargando...</div>
    );
  }

  return (
    <section className="bg-gray-100 pt-20 md:pt-36 mb-20">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl 2xl:text-6xl md:text-5xl font-normal text-primary">
          Noticias
        </h2>
        <p className="text-base md:text-lg text-gray-600 mt-2 font-lato">
          Enterate de todas{" "}
          <span className="text-primary">nuestras novedades</span>
        </p>

        <div className="relative mt-20 mx-auto max-w-[1120px] overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 px-2 snap-x snap-mandatory">
            {news.map((item) => (
              <div
                key={item.uuid}
                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-lg snap-start"
              >
                <img
                  src={item.image || "/image-1.jpeg"}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4 text-left">
                  <span className="text-sm bg-indigo-100 text-primary px-2 py-1 rounded-full inline-block mb-2">
                    {item.tags?.[0]?.name || "Novedades"}
                  </span>
                  <h3 className="font-bold text-lg text-gray-800 truncate">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {item.subtitle}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-500 text-sm">
                      {item.reading_duration} min.
                    </span>
                    <button
                      onClick={() => navigate(`/noticias/${item.uuid}`)}
                      className="text-primary font-bold hover:underline"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href="/novedades"
          className="mt-12 inline-block bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
        >
          Ir a Novedades
        </a>
      </div>
    </section>
  );
};

export default NewsCarousel;
