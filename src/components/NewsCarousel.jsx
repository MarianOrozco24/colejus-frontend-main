import React, { useEffect, useState } from "react";

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        // Usamos la API rss2json para parsear el feed RSS oficial y puramente jurídico de "Microjuris al Día"
        const rssUrl = "https://aldia.microjuris.com/feed/";
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        
        if (data.status === "ok" && data.items) {
          // Filtramos y limpiamos las noticias, nos quedamos con las primeras 8
          const formattedNews = data.items.slice(0, 8).map((item, index) => {
            // Limpieza de etiquetas HTML en la descripción
            const cleanDesc = item.description 
              ? item.description.replace(/<[^>]*>?/gm, '').trim() 
              : '';

            // Categorías reales de Microjuris (ej. Jurisprudencia, Doctrina)
            const cat = item.categories && item.categories.length > 0
              ? item.categories[0].charAt(0).toUpperCase() + item.categories[0].slice(1)
              : "Doctrina";

            // Usamos fallbacks de fotos corporativas e institucionales de la web para mantener una imagen seria
            const fallbacks = ["/image-1.jpeg", "/image-2.jpeg", "/image-5.jpeg", "/carousel-image.jpeg"];
            const img = item.thumbnail || item.enclosure?.link || fallbacks[index % fallbacks.length];

            return {
              id: item.guid || index,
              title: item.title,
              description: cleanDesc,
              date: item.pubDate,
              link: item.link,
              image: img,
              category: cat
            };
          });
          setNews(formattedNews);
        }
      } catch (error) {
        console.error("Error al cargar el feed automático de noticias", error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col justify-center items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        <p className="text-gray-500 font-lato text-sm">Actualizando novedades del ámbito legal...</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-24 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-primary tracking-tight mb-2">
          Novedades del Ámbito Jurídico
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-16 font-lato">
          Fallo jurisprudenciales, novedades normativas y doctrina legal en tiempo real.
        </p>

        {/* Carousel / Grid Wrapper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left max-w-5xl mx-auto">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-[#f8fafc] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden border border-slate-100 min-h-[380px]"
            >
              <div>
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-semibold bg-[#06092E] text-white px-2.5 py-1 rounded-full shadow-sm max-w-[150px] truncate block">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-sm text-gray-800 line-clamp-3 leading-snug mb-3 hover:text-primary transition-colors cursor-pointer" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs font-lato line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                <span className="text-gray-400 text-[10px] font-semibold">
                  📅 {formatDate(item.date)}
                </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-secondary hover:text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  Leer artículo <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <a
            href="https://aldia.microjuris.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white hover:bg-primary/95 shadow-md px-8 py-3 rounded-full font-bold transition-all transform hover:scale-[1.02] text-sm"
          >
            Ver más doctrina y fallos ↗
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsCarousel;
