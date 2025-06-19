import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { FaSearch } from "react-icons/fa";
import FilterBar from "../components/ProfesionalesFilterBar";
import ContactCard from "../components/ContactCard";
import Footer from "../components/Footer";
import { getPublicProfessionals } from "../api/professionals/getPublicProfesionals";

const Profesionales = () => {
  // State for filters
  const [selectedLocations, setSelectedLocations] = useState({
    alvear: false,
    malargue: false,
    sanRafael: false,
  });
  const [selectedLetter, setSelectedLetter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Estado para el profesional seleccionado
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const getSelectedLocationsArray = () => {
    return Object.entries(selectedLocations)
      .filter(([_, isSelected]) => isSelected)
      .map(([location]) => location);
  };

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getPublicProfessionals({
          page: pagination.currentPage,
          perPage: 12,
          search: searchTerm,
          letter: selectedLetter !== "Todos" ? selectedLetter : "",
          locations: Object.entries(selectedLocations)
            .filter(([_, isSelected]) => isSelected)
            .map(([location]) => location),
        });

        if (result.status === 200) {
          setProfessionals(result.data.professionals);
          setPagination({
            currentPage: result.data.current_page,
            totalPages: result.data.pages,
            totalItems: result.data.total,
          });
        } else {
          setError(result.data.message || "Error al cargar los profesionales");
          setProfessionals([]);
        }
      } catch (err) {
        setError(
          "Error al cargar los profesionales. Por favor, intente nuevamente."
        );
        console.error("Error fetching professionals:", err);
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [selectedLetter, selectedLocations, searchTerm, pagination.currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };
  // Mostrar información del profesional seleccionado
  const handleShowProfessionalInfo = (professional) => {
    setSelectedProfessional(professional);
  };
  // Cerrar modal
  const handleCloseModal = () => {
    setSelectedProfessional(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative h-[75vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div
          className="absolute inset-0 opacity-60 z-0"
          style={{ backgroundColor: "#06092E" }}
        ></div>

        <NavBar />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4">
          <h1
            className="2xl:text-7xl md:text-5xl font-normal mb-2"
            style={{ lineHeight: "1.5" }}
          >
            Conocé nuestro
          </h1>
          <h1
            className="2xl:text-7xl md:text-5xl font-normal mb-6"
            style={{ lineHeight: "1.5" }}
          >
            listado de profesionales
          </h1>

          <form
            onSubmit={handleSearch}
            className="flex items-center w-full max-w-md mt-4"
          >
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md flex-grow font-lato">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

      <section className="bg-gray-100 2xl:mx-52 md:mx-16">
        <div className="mt-8">
          <FilterBar
            selectedLetter={selectedLetter}
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
            setSelectedLetter={setSelectedLetter}
          />
        </div>
      </section>

      <section className="min-h-full bg-gray-100 2xl:mx-52 md:mx-16 mt-20">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <h1 className="text-primary 2xl:text-3xl md:text-2xl font-bold">
          {selectedLetter === "Todos"
            ? "Todos los profesionales"
            : selectedLetter}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-5 mt-6">
              {professionals.map((professional, index) => (
                <ContactCard
                  key={professional.uuid || index}
                  name={professional.name}
                  title={professional.title}
                  email={professional.email}
                  location={professional.location}
                  tuition={professional.tuition}
                  onClick={() => handleShowProfessionalInfo(professional)}
                />
              ))}
            </div>

            {professionals.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No se encontraron profesionales con los filtros seleccionados.
              </div>
            )}

            {professionals.length > 0 && (
              <div className="flex justify-between items-center mt-8 mb-16">
                {/* Botón de Página Anterior */}
                <button
                  className={`px-4 py-2 rounded-md border border-primary text-primary font-bold transition 
                ${pagination.currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary hover:text-white"
                    }`}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  ← Anterior
                </button>

                {/* Indicador de Página Actual */}
                <span className="text-primary font-bold">
                  Página{" "}
                  <span className="px-2 border rounded-md">
                    {pagination.currentPage}
                  </span>{" "}
                  de {pagination.totalPages}
                </span>

                {/* Botón de Página Siguiente */}
                <button
                  className={`px-4 py-2 rounded-md border border-primary text-primary font-bold transition 
                ${pagination.currentPage >= pagination.totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary hover:text-white"
                    }`}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
      {/* Modal de información del profesional */}
      {selectedProfessional && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 w-1/3 text-center">
            <h2 className="text-xl font-bold text-primary">
              {selectedProfessional.name}
            </h2>
            <p className="text-gray-600">{selectedProfessional.title}</p>
            <p className="text-gray-500">{selectedProfessional.location}</p>
            <p className="text-gray-700 mt-2">
              <strong>Dirección:</strong>{" "}
              {selectedProfessional.address || "No disponible"}
            </p>
            <p className="text-gray-700">
              <strong>Teléfono:</strong>{" "}
              {selectedProfessional.phone || "No disponible"}
            </p>
            <button
              onClick={handleCloseModal}
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
