import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchAllProfessionals } from "../../../api/professionals/fetchAllProfessionals";
import { deleteProfessionalsById } from "../../../api/professionals/deleteProfessionalsById";
import DeleteProfessionalModal from "./DeleteProfessionalModal";

const BackOfficeProfessionals = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Estado para el modal de eliminación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const fetchProfessionals = async (page) => {
    const token = localStorage.getItem("authToken");
    setLoading(true);

    try {
      const response = await fetchAllProfessionals(token, page, itemsPerPage);
      if (response.status === 200) {
        setProfessionals(response.data.professionals);
        setTotalPages(response.data.pages);
      } else {
        // setError(response.data.message || "Error al cargar los profesionales");
      }
    } catch (err) {
      setError("Error de conexión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals(currentPage);
  }, [currentPage]);

  const handleNewOpen = () => {
    navigate("/backoffice/nuevo-profesional");
  };

  const handleEditOpen = (professionalUuid) => {
    navigate(`/backoffice/editar-profesional/${professionalUuid}`);
  };

  const handleDeleteClick = (professionalItem) => {
    setSelectedProfessional(professionalItem);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await deleteProfessionalsById(
        selectedProfessional.uuid,
        token
      );

      if (response.status === 200) {
        setProfessionals((prevProfessional) =>
          prevProfessional.filter(
            (item) => item.uuid !== selectedProfessional.uuid
          )
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
    return (
      <p className="text-center text-gray-500">Cargando profesionales...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Sección <span className="text-secondary">profesionales</span>
        </h1>
        <button
          onClick={handleNewOpen}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
        >
          <FaPlus />
          <span>Nuevo profesional</span>
        </button>
      </div>

      {professionals.length === 0 ? (
        <p className="text-center text-gray-500">
          Sin profesionales creados aún
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {" "}
            {/* Evita el scroll horizontal */}
            <table className="min-w-full text-left border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-4 text-sm font-medium text-gray-500 w-1/12">
                    Matrícula
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500 w-3/12">
                    Nombre
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500 w-3/12">
                    Telefono
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500 text-center w-3/12">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4 text-md text-gray-500">
                      {item.tuition}
                    </td>
                    <td className="p-4 text-md text-gray-500">{item.name}</td>
                    <td className="p-4 text-md text-gray-800">{item.phone}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {professionals.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500">
            Página <strong>{currentPage}</strong> de{" "}
            <strong>{totalPages}</strong>
          </span>
          <div className="flex items-center space-x-2">
            {/* Botón de Página Anterior */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-2 py-1 rounded bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {"<"}
            </button>

            {/* Generación dinámica de los botones de página */}
            {(() => {
              let pages = [];
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, currentPage + 2);

              if (currentPage <= 3) {
                endPage = Math.min(totalPages, 5);
              } else if (currentPage > totalPages - 3) {
                startPage = Math.max(1, totalPages - 4);
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-2 py-1 rounded ${
                      currentPage === i
                        ? "bg-secondary text-white"
                        : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              return pages;
            })()}

            {/* Botón de Página Siguiente */}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-2 py-1 rounded bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {">"}
            </button>
          </div>
        </div>
      )}

      <DeleteProfessionalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteConfirm}
        professionalName={selectedProfessional?.name}
      />
    </div>
  );
};

export default BackOfficeProfessionals;
