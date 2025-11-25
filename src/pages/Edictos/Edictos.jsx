import React, { useState, useEffect } from "react";
import ResponsiveNav from "../../components/ResponsiveNav";
import Footer from "../../components/Footer";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../styles/derechofijo.css";
import EdictosFilterBar from "../../components/EdictosFilterBar";
import { fetchAllEdicts } from "../../api/edicts/fetchAllEdicts";
import { useNavigate } from "react-router-dom";

const PaginationControl = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-between items-center mt-8 px-4">
    <div className="flex gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border text-gray-600 disabled:text-gray-300 disabled:border-gray-200"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        if (
          pageNumber === 1 ||
          pageNumber === totalPages ||
          pageNumber === currentPage ||
          pageNumber === currentPage - 1 ||
          pageNumber === currentPage + 1
        ) {
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`w-10 h-10 rounded-md border ${
                currentPage === pageNumber
                  ? "bg-primary text-white border-primary"
                  : "text-gray-600 hover:border-primary"
              }`}
            >
              {pageNumber}
            </button>
          );
        }
        if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
          return (
            <span key={pageNumber} className="px-2">
              ...
            </span>
          );
        }
        return null;
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border text-gray-600 disabled:text-gray-300 disabled:border-gray-200"
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>

    <span className="text-primary font-bold">
      Página <span className="px-2 border rounded-md">{currentPage}</span> de{" "}
      {totalPages}
    </span>
  </div>
);

const Edictos = () => {
  const navigate = useNavigate();

  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [edicts, setEdicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // convierte a 'YYYY-MM-DD'
  };

  const fetchEdicts = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetchAllEdicts(
        token,
        page,
        10,
        false,
        searchTerm,
        formatDate(initialDate),
        formatDate(finalDate)
      );

      if (response.status === 200) {
        setEdicts(response.data.edicts);
        setTotalPages(response.data.pages);
        setCurrentPage(response.data.current_page);
      } else {
        setError(response.data.message || "Error al cargar los edictos");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdicts(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEdicts(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleViewEdict = (edictUuid) => {
    navigate(`/edictos/${edictUuid}`);
  };

  const parseToArgentinaDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setInitialDate("");
    setFinalDate("");
    setCurrentPage(1);
    fetchEdicts(1);
  };
  const ordenarEdictosPorFecha = () => {
    return edicts.slice().sort((a, b) => {
      const fechaA = a.scheduled_date
        ? new Date(a.scheduled_date)
        : new Date(a.date);
      const fechaB = b.scheduled_date
        ? new Date(b.scheduled_date)
        : new Date(b.date);
      return fechaB - fechaA; // De más reciente a más antiguo
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="relative min-h-[60vh] md:h-[75vh] bg-primary bg-cover bg-center flex flex-col justify-center items-center text-white text-center">
        <div
          className="absolute inset-0 opacity-60 z-0"
          style={{ backgroundColor: "#06092E" }}
        ></div>

        <ResponsiveNav />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-4 pt-40 md:pt-0">
          <h1 className="2xl:text-7xl md:text-5xl font-normal mb-6">Edictos</h1>

          <div className="flex items-center w-full max-w-md mt-4">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md flex-grow font-lato">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Buscar edicto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow pl-2 py-1 rounded-full text-gray-700 focus:outline-none"
              />
            </div>
            <button
              className="ml-4 bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>
        </div>
      </header>

      <section className="bg-gray-100 py-8 px-4 md:px-0 2xl:mx-52 md:mx-16 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 mt-4">
          <EdictosFilterBar
            initialDate={initialDate}
            setInitialDate={setInitialDate}
            finalDate={finalDate}
            setFinalDate={setFinalDate}
          />
          <button
            className="sm:ml-4 bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            onClick={() => fetchEdicts(1)}
          >
            Filtrar
          </button>

          <button
            className="sm:ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={handleClearFilters}
          >
            Limpiar
          </button>
        </div>
      </section>

      <section className="bg-gray-100 pb-10 px-4 md:px-0 2xl:mx-52 md:mx-16 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <>
            <div className="space-y-8">
              {ordenarEdictosPorFecha().map((edict, index) => {
                const truncateHtmlContent = (html, limit) => {
                  const tmp = document.createElement("div");
                  tmp.innerHTML = html;
                  const text = tmp.textContent || "";
                  if (text.length <= limit) return html;
                  let truncated = text.slice(0, limit) + "...";
                  tmp.textContent = truncated;
                  return `<p>${truncated}</p>`;
                };

                const displayContent = truncateHtmlContent(
                  edict.content || "",
                  200
                );

                return (
                  <div
                    key={edict.id || index}
                    className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4"
                  >
                    <h3 className="text-lg font-bold text-gray-800 break-words">
                      {edict.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {parseToArgentinaDate(edict.scheduled_date || edict.date)}
                    </p>

                    <div
                      className="text-gray-700 text-sm font-lato"
                      dangerouslySetInnerHTML={{ __html: displayContent }}
                    />
                    <button
                      className="text-gray-500 hover:text-secondary"
                      onClick={() => handleViewEdict(edict.uuid)}
                    >
                      Ver edicto
                    </button>
                  </div>
                );
              })}
            </div>

            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Edictos;
