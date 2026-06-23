import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaStar, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { fetchAllNews } from "../../../api/news/fetchAllNews";
import { deleteNewsById } from "../../../api/news/deleteNewsById";
import { toggleNewsById } from "../../../api/news/toggleNewsActive";
import { toggleNewsFeatured } from "../../../api/news/toggleNewsFeatured";
import { reorderFeaturedNews } from "../../../api/news/reorderFeaturedNews";
import DeleteNewsModal from "./DeleteNewsModal";
import { hasPermission } from "../../../utils/hasPermission";

const PublishToggle = ({ isActive, onToggle }) => (
    <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2"
        title={isActive ? "Despublicar" : "Publicar"}
    >
        <span
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                isActive ? "bg-secondary" : "bg-gray-300"
            }`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                    isActive ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
        </span>
        <span
            className={`text-xs font-medium whitespace-nowrap ${
                isActive ? "text-secondary" : "text-gray-400"
            }`}
        >
            {isActive ? "Publicada" : "Borrador"}
        </span>
    </button>
);

const BackOfficeNews = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const canManage = hasPermission("manage_news");

    const fetchNews = async (page) => {
        setLoading(true);

        try {
            const response = await fetchAllNews(page, itemsPerPage);
            if (response.status === 200) {
                setNews(response.data.news);
                setTotalPages(response.data.pages);
            } else {
                setError(response.data.message || "Error al cargar las noticias");
            }
        } catch (err) {
            setError("Error de conexión");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(currentPage);
    }, [currentPage]);

    const showActionError = (message) => {
        setActionError(message);
        setTimeout(() => setActionError(""), 4000);
    };

    const toggleStatus = async (uuid, index) => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await toggleNewsById(uuid, token);

            if (response.status === 200) {
                const updatedNews = [...news];
                updatedNews[index].is_active = response.data.is_active;
                if (!response.data.is_active) {
                    updatedNews[index].is_featured = false;
                    updatedNews[index].featured_order = null;
                }
                setNews(updatedNews);
            } else {
                showActionError(response.data.error || "No se pudo cambiar el estado.");
            }
        } catch (err) {
            console.error("Error toggling status:", err);
        }
    };

    const toggleFeatured = async (uuid, index) => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await toggleNewsFeatured(uuid, token);

            if (response.status === 200) {
                await fetchNews(currentPage);
            } else {
                showActionError(response.data.error || "No se pudo cambiar el destacado.");
            }
        } catch (err) {
            console.error("Error toggling featured:", err);
        }
    };

    const moveFeatured = async (uuid, direction) => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await reorderFeaturedNews(uuid, direction, token);

            if (response.status === 200) {
                await fetchNews(currentPage);
            } else {
                showActionError(response.data.error || response.data.message || "No se pudo reordenar.");
            }
        } catch (err) {
            console.error("Error reordering featured:", err);
        }
    };

    const handleNewOpen = () => {
        navigate("/backoffice/nueva-noticia");
    };

    const handleEditOpen = (newsUuid) => {
        navigate(`/backoffice/editar-noticia/${newsUuid}`);
    };

    const handleDeleteClick = (newsItem) => {
        setSelectedNews(newsItem);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found");
            return;
        }

        try {
            const response = await deleteNewsById(selectedNews.uuid, token);

            if (response.status === 200) {
                setNews((prevNews) => prevNews.filter((item) => item.uuid !== selectedNews.uuid));
                setIsModalOpen(false);
            } else {
                console.error("Failed to delete news:", response.data.message || "Unknown error");
            }
        } catch (err) {
            console.error("Error deleting news:", err);
        }
    };

    const renderActions = (item, index) => {
        if (!canManage) return null;

        return (
            <div className="flex items-center justify-center flex-wrap gap-3">
                <button
                    type="button"
                    className="text-gray-500 hover:text-secondary"
                    onClick={() => handleEditOpen(item.uuid)}
                    title="Editar"
                >
                    <FaEdit size={20} />
                </button>
                <button
                    type="button"
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => handleDeleteClick(item)}
                    title="Eliminar"
                >
                    <FaTrash size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => toggleFeatured(item.uuid, index)}
                    className={`${item.is_featured ? "text-secondary" : "text-gray-300"} hover:text-secondary`}
                    title={item.is_featured ? "Quitar destacada" : "Marcar como destacada"}
                    disabled={!item.is_active && !item.is_featured}
                >
                    <FaStar size={20} />
                </button>
                {item.is_featured && (
                    <>
                        <button
                            type="button"
                            onClick={() => moveFeatured(item.uuid, "up")}
                            className="text-gray-400 hover:text-primary"
                            title="Subir orden"
                        >
                            <FaArrowUp size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => moveFeatured(item.uuid, "down")}
                            className="text-gray-400 hover:text-primary"
                            title="Bajar orden"
                        >
                            <FaArrowDown size={16} />
                        </button>
                    </>
                )}
                <PublishToggle
                    isActive={item.is_active}
                    onToggle={() => toggleStatus(item.uuid, index)}
                />
            </div>
        );
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando noticias...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-primary">
                    Sección <span className="text-secondary">novedades</span>
                </h1>
                {canManage && (
                    <button
                        onClick={handleNewOpen}
                        className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
                    >
                        <FaPlus />
                        <span>Nueva noticia</span>
                    </button>
                )}
            </div>

            {actionError && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                    {actionError}
                </div>
            )}

            {news.length === 0 ? (
                <p className="text-center text-gray-500">Sin noticias creadas aún</p>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-[640px] w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">Fecha</th>
                                <th className="p-4 text-sm font-medium text-gray-500 w-5/12">Título</th>
                                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">Estado</th>
                                {canManage && <th className="p-4 text-sm font-medium text-gray-500 text-center w-3/12">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((item, index) => (
                                <tr key={item.uuid} className="border-b">
                                    <td className="p-4 text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm text-gray-800">
                                        <div className="flex items-center gap-2">
                                            {item.is_featured && (
                                                <FaStar className="text-secondary shrink-0" title="Destacada" />
                                            )}
                                            <span>{item.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        {item.is_featured ? (
                                            <span className="text-secondary font-medium text-xs uppercase">Destacada</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                    </td>
                                    {canManage && (
                                        <td className="p-4">
                                            {renderActions(item, index)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    <div className="md:hidden divide-y">
                        {news.map((item, index) => (
                            <div key={item.uuid} className="p-4 space-y-2">
                                <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</div>
                                <div className="text-base font-medium text-gray-800 flex items-center gap-2">
                                    {item.is_featured && <FaStar className="text-secondary" />}
                                    {item.title}
                                </div>
                                {canManage && (
                                    <div className="flex items-center justify-end">
                                        {renderActions(item, index)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {news.length > 0 && (
                <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="text-gray-500">
                        Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                    </span>
                    <div className="flex items-center space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={`px-2 py-1 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"}`}
                        >
                            {"<"}
                        </button>
                        {[...Array(totalPages).keys()].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page + 1)}
                                className={`px-2 py-1 rounded ${currentPage === page + 1 ? "bg-secondary text-white" : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"}`}
                            >
                                {page + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className={`px-2 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-500 hover:bg-secondary hover:text-white"}`}
                        >
                            {">"}
                        </button>
                    </div>
                </div>
            )}

            <DeleteNewsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={handleDeleteConfirm}
                newsTitle={selectedNews?.title}
            />
        </div>
    );
};

export default BackOfficeNews;
