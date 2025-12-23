import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { fetchAllEdicts } from "../../../api/edicts/fetchAllEdicts";
import { deleteEdictById } from "../../../api/edicts/deleteEdictsById";
import DeleteEdictModal from "./DeleteEdictModal";

const BackOfficeEdicts = () => {
  const navigate = useNavigate();

  // --- Estados ---
  // 1) Todos los edictos para búsqueda local
  const [allEdicts, setAllEdicts] = useState([]);
  // 2) Edictos de la página actual (backend)
  const [edicts, setEdicts] = useState([]);
  // 3) Búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  // 4) Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  // 5) Carga / error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 6) Modal de borrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEdict, setSelectedEdict] = useState(null);

  // --- Helpers ---
  const parseToArgentinaDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // --- 1) Al montar: cargo TODOS los edictos para búsqueda ---
  useEffect(() => {
    const loadAll = async () => {
      try {
        const token = localStorage.getItem("authToken");
        // Página 1 con 10k items para simular "todos"
        const resp = await fetchAllEdicts(token, 1, 10000, true);
        if (resp.status === 200) {
          setAllEdicts(resp.data.edicts);
        } else {
          setError(resp.data.message || "Error cargando todos los edictos");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión al cargar todos los edictos");
      }
    };
    loadAll();
  }, []);

  // --- 2) Paginación backend: se dispara si NO hay búsqueda activa ---
  useEffect(() => {
    if (searchTerm.trim() !== "") return;
    const loadPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const resp = await fetchAllEdicts(token, currentPage, itemsPerPage, true);
        if (resp.status === 200) {
          setEdicts(resp.data.edicts);
          setTotalPages(resp.data.pages);
        } else {
          setError(resp.data.message || "Error cargando edictos");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [currentPage, searchTerm]);

  // --- 3) Filtrado y paginado local cuando hay búsqueda ---
  const filtered = searchTerm
    ? allEdicts.filter((e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parseToArgentinaDate(e.date).includes(searchTerm)
    )
    : [];

  const totalPagesLocal = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItemsLocal = filtered.slice(startIndex, startIndex + itemsPerPage);

  // --- 4) Decidir lista a mostrar y páginas ---
  const displayList = searchTerm.trim() ? pageItemsLocal : edicts;
  const displayTotalPages = searchTerm.trim() ? totalPagesLocal : totalPages;

  // --- Handlers CRUD ---
  const handleNew = () => navigate("/backoffice/nuevo-edicto");
  const handleEdit = (uuid) => navigate(`/backoffice/editar-edicto/${uuid}`);
  const handleDeleteClick = (item) => {
    setSelectedEdict(item);
    setIsModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const resp = await deleteEdictById(selectedEdict.uuid, token);
      if (resp.status === 200) {
        // actualizar listas
        setAllEdicts((a) => a.filter((e) => e.uuid !== selectedEdict.uuid));
        if (!searchTerm.trim()) {
          setEdicts((e) => e.filter((x) => x.uuid !== selectedEdict.uuid));
          setTotalPages((tp) => Math.max(tp, 1));
        }
      } else {
        console.error(resp.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  // --- Handlers de paginado ---
  const prevPage = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, displayTotalPages));

  // --- Render ---
  if (loading) return <p className="text-center text-gray-500">Cargando edictos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Sección <span className="text-secondary">edictos</span>
        </h1>
        <button
          onClick={handleNew}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
        >
          <FaPlus /><span>Nuevo edicto</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 flex-1">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar en todos los edictos por título o fecha..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      {displayList.length === 0 ? (
        <p className="text-center text-gray-500">No hay edictos para mostrar.</p>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto hidden md:block">
          <table className="min-w-[720px] w-full text-left border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">Fecha</th>
                <th className="p-4 text-sm font-medium text-gray-500 w-7/12">Título</th>
                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">Estado</th>
                <th className="p-4 text-sm font-medium text-gray-500 text-center w-3/12">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((item) => {
                const isPublished = new Date(item.scheduled_date) <= new Date();
                return (
                  <tr key={item.uuid} className="border-b">
                    <td className="p-4 text-sm text-gray-500">
                      {parseToArgentinaDate(item.date)}
                    </td>
                    <td className="p-4 text-sm text-gray-800 truncate max-w-[250px]" title={item.title}>
                      {item.title}
                    </td>
                    <td className="p-4 text-sm">
                      {isPublished
                        ? <span className="text-green-600 font-medium">Publicado</span>
                        : <span className="text-yellow-600 font-medium">
                          Programado para {parseToArgentinaDate(item.scheduled_date)}
                        </span>
                      }
                    </td>
                    <td className="p-4 flex items-center justify-center space-x-4">
                      <button onClick={() => handleEdit(item.uuid)} className="text-gray-500 hover:text-secondary">
                        <FaEdit size={20} />
                      </button>
                      <button onClick={() => handleDeleteClick(item)} className="text-gray-500 hover:text-red-500">
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          <div className="md:hidden divide-y">
            {displayList.map((item) => {
              const isPublished = new Date(item.scheduled_date) <= new Date();
              return (
                <div key={item.uuid} className="p-4 space-y-2">
                  <div className="text-xs text-gray-500">{parseToArgentinaDate(item.date)}</div>
                  <div className="text-base font-medium text-gray-800">{item.title}</div>
                  <div className="text-sm">
                    {isPublished ? (
                      <span className="text-green-600 font-medium">Publicado</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        Programado para {parseToArgentinaDate(item.scheduled_date)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-3 text-gray-500">
                    <button onClick={() => handleEdit(item.uuid)} className="hover:text-secondary">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteClick(item)} className="hover:text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Paginación */}
      {displayList.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={prevPage}
            className={`px-2 py-1 rounded ${currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
              }`}
          >
            {"<"}
          </button>

          <span className="text-gray-500">
            Página <strong>{currentPage}</strong> de <strong>{displayTotalPages}</strong>
          </span>

          <button
            disabled={currentPage === displayTotalPages}
            onClick={nextPage}
            className={`px-2 py-1 rounded ${currentPage === displayTotalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"
              }`}
          >
            {">"}
          </button>
        </div>
      )}

      {/* Modal de eliminación */}
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
