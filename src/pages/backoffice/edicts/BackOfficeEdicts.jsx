import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchAllEdicts } from "../../../api/edicts/fetchAllEdicts";
import { deleteEdictById } from "../../../api/edicts/deleteEdictsById";
import DeleteEdictModal from "./DeleteEdictModal";

const BackOfficeEdicts = () => {
  const navigate = useNavigate();

  // Datos
  const [edicts, setEdicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal de borrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEdict, setSelectedEdict] = useState(null);

  // Traer edictos desde API
  const fetchEdicts = async (page) => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const response = await fetchAllEdicts(token, page, itemsPerPage, true);
      if (response.status === 200) {
        setEdicts(response.data.edicts);
      } else {
        setError(response.data.message || "Error al cargar edictos");
      }
    } catch (err) {
      setError("Error de conexión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdicts(currentPage);
  }, [currentPage]);

  // Convierte "YYYY-MM-DD" a formato "DD/MM/YYYY"
  const parseToArgentinaDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Manejo de delete
  const handleDeleteClick = (item) => {
    setSelectedEdict(item);
    setIsModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await deleteEdictById(selectedEdict.uuid, token);
      if (response.status === 200) {
        setEdicts((prev) =>
          prev.filter((e) => e.uuid !== selectedEdict.uuid)
        );
      } else {
        console.error(
          "No se pudo eliminar:",
          response.data.message || "Error desconocido"
        );
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setIsModalOpen(false);
    }
  };

  // 1) Filtrar en cliente por título o fecha
  const edictsFiltrados = edicts.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)
  );

  // 2) Calcular páginas según filtro
  const totalPagesCliente = Math.ceil(
    edictsFiltrados.length / itemsPerPage
  );

  // 3) Índices para slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 4) Array paginado
  const edictsPaginados = edictsFiltrados.slice(
    startIndex,
    endIndex
  );

  // Render
  if (loading) {
    return <p className="text-center text-gray-500">Cargando edictos...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Sección <span className="text-secondary">edictos</span>
        </h1>
        <button
          onClick={() => navigate("/backoffice/nuevo-edicto")}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
        >
          <FaPlus />
          <span>Nuevo edicto</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por título o fecha..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      {/* Tabla */}
      {edictsFiltrados.length === 0 ? (
        <p className="text-center text-gray-500">
          Sin edictos que mostrar
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">
                  Fecha
                </th>
                <th className="p-4 text-sm font-medium text-gray-500 w-7/12">
                  Título
                </th>
                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">
                  Estado
                </th>
                <th className="p-4 text-sm font-medium text-gray-500 text-center w-3/12">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {edictsPaginados.map((item, idx) => {
                const isPublished =
                  new Date(item.scheduled_date) <= new Date();
                return (
                  <tr key={idx} className="border-b">
                    <td className="p-4 text-sm text-gray-500">
                      {parseToArgentinaDate(item.date)}
                    </td>
                    <td
                      className="p-4 text-sm text-gray-800 truncate max-w-[250px]"
                      title={item.title}
                    >
                      {item.title}
                    </td>
                    <td className="p-4 text-sm">
                      {isPublished ? (
                        <span className="text-green-600 font-medium">
                          Publicado
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Programado para{" "}
                          {parseToArgentinaDate(item.scheduled_date)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 flex items-center justify-center space-x-4">
                      <button
                        onClick={() => navigate(`/backoffice/editar-edicto/${item.uuid}`)}
                        className="text-gray-500 hover:text-secondary"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {edictsFiltrados.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500">
            Página <strong>{currentPage}</strong> de{" "}
            <strong>{totalPagesCliente}</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              className={`px-2 py-1 rounded ${currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
                }`}
            >
              {"<"}
            </button>

            {/* Números de página */}
            {Array.from(
              { length: Math.min(totalPagesCliente, 5) },
              (_, idx) => {
                const startPage = Math.max(
                  Math.min(currentPage - 2, totalPagesCliente - 4),
                  1
                );
                const pageNumber = startPage + idx;
                if (pageNumber > totalPagesCliente) return null;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-2 py-1 rounded ${pageNumber === currentPage
                      ? "bg-secondary text-white"
                      : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}

            <button
              disabled={currentPage === totalPagesCliente}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPagesCliente)
                )
              }
              className={`px-2 py-1 rounded ${currentPage === totalPagesCliente
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
                }`}
            >
              {">"}
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de borrado */}
      <DeleteEdictModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteConfirm}
        newsTitle={selectedEdict?.title}
      />
    </div>
  );
};

export default BackOfficeEdicts;
