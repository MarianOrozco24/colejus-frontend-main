import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicEdictById } from "../../api/edicts/fetchPublicEdictById";
import ResponsiveNav from "../../components/ResponsiveNav";
import Footer from "../../components/Footer";

const VerEdicto = () => {
  const [edict, setEdict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { uuid } = useParams();

  useEffect(() => {
    const loadEdict = async () => {
      try {
        setLoading(true);
        const response = await fetchPublicEdictById(uuid, null);

        if (response.status === 200) {
          setEdict(response.data);
        } else {
          setError(response.data.message || "No se pudo cargar el edicto");
        }
      } catch (err) {
        setError(
          "No se pudo cargar el edicto. Por favor, intente nuevamente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      loadEdict();
    }
  }, [uuid]);
  const parseToArgentinaDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <header className="relative min-h-[60vh] md:h-[65vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div
          className="absolute inset-0 opacity-60 z-0"
          style={{ backgroundColor: "#06092E" }}
        ></div>
        <ResponsiveNav />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4 pt-40 md:pt-0">
          <h1
            className="text-4xl font-normal mb-4 truncate overflow-hidden whitespace-nowrap text-ellipsis max-w-[90%]"
            title={edict?.title}
          >
            {edict?.title}
          </h1>
          {edict?.subtitle && (
            <h2 className="text-xl font-normal mb-2">{edict.subtitle}</h2>
          )}
        </div>
      </header>

      <section className="bg-white container mx-auto px-4 py-12">
        <div className="bg-white p-8">
          <p className="text-xs mb-20">
            Fecha: {parseToArgentinaDate(edict?.scheduled_date || edict?.date)}
          </p>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: edict?.content || "" }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VerEdicto;
