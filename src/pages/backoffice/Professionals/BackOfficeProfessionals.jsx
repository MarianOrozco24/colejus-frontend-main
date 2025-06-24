import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchAllProfessionals } from "../../../api/professionals/fetchAllProfessionals";
import { deleteProfessionalsById } from "../../../api/professionals/deleteProfessionalsById";
import DeleteProfessionalModal from "./DeleteProfessionalModal";

const BackOfficeProfessionals = () => {
  const navigate = useNavigate();

  // Datos y estados básicos
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación (cliente)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal de eliminación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  // Fetch desde API
  const fetchProfessionals = async (page) => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const resp = await fetchAllProfessionals(token, page, itemsPerPage);
      if (resp.status === 200) {
        setProfessionals(resp.data.professionals);
      } else {
        setError(resp.data.message || "Error al cargar profesionales");
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

  // Delete handlers
  const handleDeleteClick = (item) => {
    setSelectedProfessional(item);
    setIsModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const resp = await deleteProfessionalsById(selectedProfessional.uuid, token);
      if (resp.status === 200) {
        setProfessionals((prev) =>
          prev.filter((p) => p.uuid !== selectedProfessional.uuid)
        );
      } else {
        console.error("Error al eliminar:", resp.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  // Filtrado por matrícula o nombre (incluye apellido)
  const filtered = professionals.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const matchesTuition = p.tuition.toLowerCase().includes(term);
    const matchesName = p.name.toLowerCase().includes(term);
    return matchesTuition || matchesName;
  });

  // Paginación en cliente
  const totalPagesCliente = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = filtered.slice(startIndex, endIndex);

  if (loading) return <p className="text-center text-gray-500">Cargando profesionales...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Sección <span className="text-secondary">profesionales</span>
        </h1>
        <button
          onClick={() => navigate("/backoffice/nuevo-profesional")}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
        >
          <FaPlus />
          <span>Nuevo profesional</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por matrícula o nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">Sin profesionales que mostrar</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-4 text-sm font-medium text-gray-500 w-1/12">Matrícula</th>
                  <th className="p-4 text-sm font-medium text-gray-500 w-3/12">Nombre</th>
                  <th className="p-4 text-sm font-medium text-gray-500 w-3/12">Teléfono</th>
                  <th className="p-4 text-sm font-medium text-gray-500 text-center w-3/12">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item, idx) => (
                  <tr key={item.uuid || idx} className="border-b">
                    <td className="p-4 text-md text-gray-500">{item.tuition}</td>
                    <td className="p-4 text-md text-gray-500">{item.name}</td>
                    <td className="p-4 text-md text-gray-800">{item.phone}</td>
                    <td className="p-4 flex items-center justify-center space-x-4">
                      <button
                        onClick={() => navigate(`/backoffice/editar-profesional/${item.uuid}`)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paginación */}
      {filtered.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500">
            Página <strong>{currentPage}</strong> de <strong>{totalPagesCliente}</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-2 py-1 rounded bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {"<"}
            </button>
            {Array.from({ length: Math.min(totalPagesCliente, 5) }, (_, i) => {
              const startPage = Math.max(Math.min(currentPage - 2, totalPagesCliente - 4), 1);
              const pageNum = startPage + i;
              if (pageNum > totalPagesCliente) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-1 rounded ${pageNum === currentPage
                    ? "bg-secondary text-white"
                    : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPagesCliente}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPagesCliente))}
              className="px-2 py-1 rounded bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {">"}
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
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
