import React, { useState, useEffect } from "react";
import ResponsiveNav from "../components/ResponsiveNav";
import { FaSearch } from "react-icons/fa";
import FilterBar from "../components/ProfesionalesFilterBar";
import ContactCard from "../components/ContactCard";
import Footer from "../components/Footer";
import { getPublicProfessionals } from "../api/professionals/getPublicProfesionals";

const Profesionales = () => {
  const [selectedLocations, setSelectedLocations] = useState({
    alvear: false,
    malargue: false,
    sanRafael: false,
  });
  const [selectedProfession, setSelectedProfession] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProfessional, setSelectedProfessional] = useState(null);

  // Debounce de búsqueda
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Fetch de profesionales (con debounce)
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await getPublicProfessionals({
          page: currentPage,
          perPage: 12,
          search: debouncedSearchTerm,
          title: selectedProfession !== "Todos" ? selectedProfession : "",
          locations: Object.entries(selectedLocations)
            .filter(([, sel]) => sel)
            .map(([loc]) => loc),
        });

        if (resp.status === 200) {
          setProfessionals(resp.data.professionals);
          setTotalPages(resp.data.pages);
        } else {
          setError(resp.data.message || "Error al cargar profesionales");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión. Intente otra vez.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [currentPage, debouncedSearchTerm, selectedProfession, selectedLocations]);

  const handleSearch = e => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative min-h-[55vh] pb-16 bg-[#06092E] flex flex-col justify-start items-center text-white text-center overflow-hidden">
        {/* Fondo con degradado elegante a juego con Nosotros y Novedades */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06092E] via-[#080c3e] to-[#040620] z-0"></div>

        {/* Navbar */}
        <div className="w-full z-20">
          <ResponsiveNav />
        </div>

        {/* Contenido principal del título y buscador */}
        <div className="flex flex-col justify-center items-center text-center z-10 px-6 flex-1 mt-28 md:mt-36 w-full max-w-4xl">
          <h1
            className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight"
            style={{ lineHeight: "1.2" }}
          >
            Nuestros Profesionales
          </h1>
          <p className="text-slate-300 font-light max-w-2xl text-sm md:text-base font-lato leading-relaxed mb-8">
            Buscá abogados y procuradores matriculados vigentes dentro de la Segunda Circunscripción Judicial de Mendoza.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
            <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full font-lato transition-all duration-300 border border-slate-200 focus-within:border-secondary">
              <FaSearch className="text-gray-400 mr-2 text-lg shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Nombre, apellido o número de matrícula..."
                className="flex-grow text-gray-700 bg-transparent focus:outline-none text-sm md:text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-secondary text-white font-bold px-8 py-3 rounded-full hover:bg-secondary/90 hover:scale-[1.02] shadow-[0_4px_15px_rgba(40,47,136,0.3)] transition-all duration-300 shrink-0 w-full sm:w-auto text-sm md:text-base"
            >
              Buscar
            </button>
          </form>
        </div>
      </header>

      <section className="bg-gray-100 px-4 md:px-0 2xl:mx-52 md:mx-16 mt-8">
        <FilterBar
          selectedProfession={selectedProfession}
          selectedLocations={selectedLocations}
          setSelectedProfession={profession => {
            setSelectedProfession(profession);
            setCurrentPage(1);
          }}
          setSelectedLocations={locs => {
            setSelectedLocations(locs);
            setCurrentPage(1);
          }}
        />
      </section>

      <section className="min-h-full bg-gray-100 px-4 md:px-0 2xl:mx-52 md:mx-16 mt-20">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <h2 className="text-primary text-xl md:text-2xl font-serif font-semibold tracking-tight">
          {selectedProfession === "Todos"
            ? "Todos los profesionales"
            : selectedProfession === "Abogado"
            ? "Abogados matriculados"
            : "Procuradores matriculados"}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-5 mt-6">
              {professionals.map((p, i) => (
                <ContactCard
                  key={p.uuid || i}
                  {...p}
                  onClick={() => setSelectedProfessional(p)}
                />
              ))}
            </div>

            {professionals.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No se encontraron profesionales con esos filtros.
              </div>
            )}

            {professionals.length > 0 && (
              <div className="flex justify-between items-center mt-8 mb-16">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md border border-primary font-bold transition ${currentPage === 1
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "text-primary hover:bg-primary hover:text-white"
                    }`}
                >
                  ← Anterior
                </button>

                <span className="text-primary font-bold">
                  Página <span className="px-2 border rounded-md">{currentPage}</span> de {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`px-4 py-2 rounded-md border border-primary font-bold transition ${currentPage >= totalPages
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "text-primary hover:bg-primary hover:text-white"
                    }`}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />

      {selectedProfessional && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 text-center">
            <h2 className="text-xl font-bold text-primary">{selectedProfessional.name}</h2>
            <p className="text-gray-600">{selectedProfessional.title}</p>
            <p className="text-gray-500">Mat. {selectedProfessional.tuition || "—"}</p>
            <p className="text-gray-500">{selectedProfessional.location}</p>
            <p className="text-gray-700 mt-2">
              <strong>Dirección:</strong> {selectedProfessional.address || "No disponible"}
            </p>
            <p className="text-gray-700">
              <strong>Teléfono:</strong> {selectedProfessional.phone || "No disponible"}
            </p>
            <button
              onClick={() => setSelectedProfessional(null)}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profesionales;
