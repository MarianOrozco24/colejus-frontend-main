import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { fetchAllNews } from "../../../api/news/fetchAllNews";
import { deleteNewsById } from "../../../api/news/deleteNewsById";
import { toggleNewsById } from "../../../api/news/toggleNewsActive";
import DeleteNewsModal from "./DeleteNewsModal";

const BackOfficeNews = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Delete modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const fetchNews = async (page) => {
        const token = localStorage.getItem("authToken");
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

    const toggleStatus = async (uuid, index) => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await toggleNewsById(uuid, token);

            if (response.status === 200) {
                const updatedNews = [...news];
                updatedNews[index].is_active = !updatedNews[index].is_active;
                setNews(updatedNews);
            } else {
                console.error('Failed to toggle news:', response.data.message || 'Unknown error');
            }
        } catch (err) {
            console.error("Error toggling status:", err);
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
                <button
                    onClick={handleNewOpen}
                    className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
                >
                    <FaPlus />
                    <span>Nueva noticia</span>
                </button>
            </div>

            {news.length === 0 ? (
                <p className="text-center text-gray-500">Sin noticias creadas aún</p>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-[640px] w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">Fecha</th>
                                <th className="p-4 text-sm font-medium text-gray-500 w-7/12">Título</th>
                                <th className="p-4 text-sm font-medium text-gray-500 text-center w-3/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-4 text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm text-gray-800">{item.title}</td>
                                    <td className="p-4 flex items-center justify-center space-x-4">
                                        <button className="text-gray-500 hover:text-secondary">
                                            <FaEdit size={20} onClick={() => handleEditOpen(item.uuid)} />
                                        </button>
                                        <button className="text-gray-500 hover:text-red-500">
                                            <FaTrash size={20} onClick={() => handleDeleteClick(item)} />
                                        </button>
                                        <button
                                            className={`text-${item.is_active ? "secondary" : "gray-400"} hover:text-secondary`}
                                            onClick={() => toggleStatus(item.uuid, index)}
                                        >
                                            {item.is_active ? <BsToggleOff size={26} /> : <BsToggleOn size={26} className="text-primary" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    {/* Mobile cards */}
                    <div className="md:hidden divide-y">
                        {news.map((item, index) => (
                            <div key={index} className="p-4 space-y-2">
                                <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</div>
                                <div className="text-base font-medium text-gray-800">{item.title}</div>
                                <div className="flex items-center justify-end gap-3 text-gray-500">
                                    <button onClick={() => handleEditOpen(item.uuid)} className="hover:text-secondary">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteClick(item)} className="hover:text-red-500">
                                        <FaTrash />
                                    </button>
                                    <button onClick={() => toggleStatus(item.uuid, index)}>
                                        {item.is_active ? <BsToggleOff size={24} /> : <BsToggleOn size={24} className="text-primary" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination */}
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

            {/* Delete Modal */}
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
