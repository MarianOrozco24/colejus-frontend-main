import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { fetchAllProfessionals } from "../../../api/professionals/fetchAllProfessionals";
import { deleteProfessionalsById } from "../../../api/professionals/deleteProfessionalsById";
import DeleteProfessionalModal from "./DeleteProfessionalModal";

const BackOfficeProfessionals = () => {
  const navigate = useNavigate();

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const loadPage = async (page, term = "") => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const resp = await fetchAllProfessionals(token, page, itemsPerPage, term);
      if (resp.status === 200) {
        setProfessionals(resp.data.professionals);
        setTotalPages(resp.data.pages);
      } else {
        setError(resp.data.message || "Error al cargar profesionales");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleNewOpen = () => navigate("/backoffice/nuevo-profesional");
  const handleEditOpen = (uuid) => navigate(`/backoffice/editar-profesional/${uuid}`);
  const handleDeleteClick = (item) => {
    setSelectedProfessional(item);
    setIsModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const resp = await deleteProfessionalsById(selectedProfessional.uuid, token);
      if (resp.status === 200) {
        loadPage(currentPage, searchTerm);
      } else {
        console.error(resp.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  if (loading) return <p className="text-center text-gray-500">Cargando profesionales...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
          <FaPlus /><span>Nuevo profesional</span>
        </button>
      </div>

      <div className="mb-4 flex items-center space-x-2">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por matrícula o nombre..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      {professionals.length === 0 ? (
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
                {professionals.map(item => (
                  <tr key={item.uuid} className="border-b">
                    <td className="p-4 text-md text-gray-500">{item.tuition}</td>
                    <td className="p-4 text-md text-gray-500">{item.name}</td>
                    <td className="p-4 text-md text-gray-800">{item.phone}</td>
                    <td className="p-4 flex items-center justify-center space-x-4">
                      <button onClick={() => handleEditOpen(item.uuid)} className="text-gray-500 hover:text-secondary">
                        <FaEdit size={20} />
                      </button>
                      <button onClick={() => handleDeleteClick(item)} className="text-gray-500 hover:text-red-500">
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

      {professionals.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded ${currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
              }`}
          >
            {"<"}
          </button>

          <span className="text-gray-500">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded ${currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
              }`}
          >
            {">"}
          </button>
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
