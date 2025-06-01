import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchAllEdicts } from "../../../api/edicts/fetchAllEdicts";
import { deleteEdictById } from "../../../api/edicts/deleteEdictsById";
import DeleteEdictModal from "./DeleteEdictModal";

const BackOfficeEdicts = () => {
  const navigate = useNavigate();
  const [edicts, setEdicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Delete modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEdict, setSelectedEdict] = useState(null);

  const fetchEdicts = async (page) => {
    const token = localStorage.getItem("authToken");
    setLoading(true);

    try {
      const response = await fetchAllEdicts(token, page, itemsPerPage, true);
      if (response.status === 200) {
        setEdicts(response.data.edicts);
        setTotalPages(response.data.pages);
      } else {
        setError(response.data.message || "Error al cargar las edictos");
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

  const handleNewOpen = () => {
    navigate("/backoffice/nuevo-edicto");
  };

  const handleEditOpen = (edictUuid) => {
    navigate(`/backoffice/editar-edicto/${edictUuid}`);
  };

  const handleDeleteClick = (edictItem) => {
    setSelectedEdict(edictItem);
    setIsModalOpen(true);
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

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await deleteEdictById(selectedEdict.uuid, token);

      if (response.status === 200) {
        setEdicts((prevEdict) =>
          prevEdict.filter((item) => item.uuid !== selectedEdict.uuid)
        );
        setIsModalOpen(false);
      } else {
        console.error(
          "Failed to delete news:",
          response.data.message || "Unknown error"
        );
      }
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando edictos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Sección <span className="text-secondary">edictos</span>
        </h1>
        <button
          onClick={handleNewOpen}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
        >
          <FaPlus />
          <span>Nuevo edicto</span>
        </button>
      </div>

      {edicts.length === 0 ? (
        <p className="text-center text-gray-500">Sin edictos creados aún</p>
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
              {edicts.map((item, index) => {
                const isPublished = new Date(item.scheduled_date) <= new Date();

                return (
                  <tr key={index} className="border-b">
                    <td className="p-4 text-sm text-gray-500">
                      {parseToArgentinaDate(item.date)}
                    </td>
                    <td
                      className="p-4 text-sm text-gray-800 overflow-hidden truncate whitespace-nowrap max-w-[250px]"
                      title={item.title}
                    >
                      {item.title}
                    </td>

                    {/* NUEVA COLUMNA: Estado */}
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
                      <button className="text-gray-500 hover:text-secondary">
                        <FaEdit
                          size={20}
                          onClick={() => handleEditOpen(item.uuid)}
                        />
                      </button>
                      <button className="text-gray-500 hover:text-red-500">
                        <FaTrash
                          size={20}
                          onClick={() => handleDeleteClick(item)}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {edicts.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500">
            Página <strong>{currentPage}</strong> de{" "}
            <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-2 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
              }`}
            >
              {"<"}
            </button>

            {/* Botones dinámicos */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              let startPage = Math.max(
                Math.min(currentPage - 2, totalPages - 4),
                1
              );
              const pageNumber = startPage + idx;

              if (pageNumber > totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-2 py-1 rounded ${
                    currentPage === pageNumber
                      ? "bg-secondary text-white"
                      : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`px-2 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
              }`}
            >
              {">"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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
