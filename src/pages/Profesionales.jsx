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
  const [selectedLetter, setSelectedLetter] = useState("Todos");
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
          letter: selectedLetter !== "Todos" ? selectedLetter : "",
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
  }, [currentPage, debouncedSearchTerm, selectedLetter, selectedLocations]);

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
      <header className="relative h-[75vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div className="absolute inset-0 opacity-60 z-0" style={{ backgroundColor: "#06092E" }} />
        <ResponsiveNav />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4 pt-40 md:pt-0">
          <h1 className="2xl:text-7xl md:text-5xl font-normal mb-2" style={{ lineHeight: "1.5" }}>
            Conocé nuestro
          </h1>
          <h1 className="2xl:text-7xl md:text-5xl font-normal mb-6" style={{ lineHeight: "1.5" }}>
            listado de profesionales
          </h1>
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-md mt-4">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md flex-grow font-lato">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o matrícula"
                className="flex-grow pl-2 py-1 rounded-full text-gray-700 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-4 bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition"
            >
              Buscar
            </button>
          </form>
        </div>
      </header>

      <section className="bg-gray-100 px-4 md:px-0 2xl:mx-52 md:mx-16 mt-8">
        <FilterBar
          selectedLetter={selectedLetter}
          selectedLocations={selectedLocations}
          setSelectedLetter={letter => {
            setSelectedLetter(letter);
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

        <h1 className="text-primary 2xl:text-3xl md:text-2xl font-bold">
          {selectedLetter === "Todos" ? "Todos los profesionales" : selectedLetter}
        </h1>

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
