import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchNewsById } from "../api/news/fetchNewsById";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const VerNoticia = () => {
  const { uuid } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNewsItem = async () => {
      try {
        const response = await fetchNewsById(uuid);
        if (response.status === 200) {
          setNewsItem(response.data);
        } else {
          setError("No se pudo cargar la noticia.");
        }
      } catch (err) {
        setError("Error al cargar la noticia.");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      loadNewsItem();
    }
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <header className="relative h-[65vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div className="absolute inset-0 opacity-60 z-0 bg-[#06092E]"></div>
        <NavBar />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-4 text-white">
          <h1 className="text-4xl font-bold mb-4">{newsItem.title}</h1>
          {newsItem.subtitle && (
            <h2 className="text-xl">{newsItem.subtitle}</h2>
          )}
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <p className="text-sm text-gray-600 mb-8">
          Tiempo de lectura: {newsItem.reading_duration}m
        </p>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: newsItem.content }}
        />
      </section>

      <Footer />
    </div>
  );
};

export default VerNoticia;
