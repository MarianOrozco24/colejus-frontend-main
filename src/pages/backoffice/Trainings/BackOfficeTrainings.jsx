import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { fetchAllTrainings } from "../../../api/trainings/fetchAllTrainings";
import { deleteTrainingById } from "../../../api/trainings/deleteTrainingById";
import { toggleTrainingById } from "../../../api/trainings/toggleTrainingActive";
import DeleteTrainingModal from "./DeleteTrainingModal";

const BackOfficeTrainings = () => {
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Delete modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);

    const fetchTrainings = async (page) => {
        const token = localStorage.getItem("authToken");
        setLoading(true);

        try {
            const response = await fetchAllTrainings(token, page, itemsPerPage);
            if (response.status === 200) {
                setTrainings(response.data.trainings);
                setTotalPages(response.data.pages);
            } else {
                setError(response.data.message || "Error al cargar las capacitaciones");
            }
        } catch (err) {
            setError("Error de conexión");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainings(currentPage);
    }, [currentPage]);

    const toggleStatus = async (uuid, index) => {
        const token = localStorage.getItem("authToken");
        try {
            const response = await toggleTrainingById(uuid, token);

            if (response.status === 200) {
                const updatedTrainings = [...trainings];
                updatedTrainings[index].is_active = !updatedTrainings[index].is_active;
                setTrainings(updatedTrainings);
            } else {
                console.error('Failed to toggle trainings:', response.data.message || 'Unknown error');
            }
        } catch (err) {
            console.error("Error toggling status:", err);
        }
    };

    const handleNewOpen = () => {
        navigate("/backoffice/nueva-capacitacion");
    };

    const handleEditOpen = (trainingUuid) => {
        navigate(`/backoffice/editar-capacitacion/${trainingUuid}`);
    };

    const handleDeleteClick = (trainingItem) => {
        setSelectedTraining(trainingItem);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No authentication token found");
            return;
        }

        try {
            const response = await deleteTrainingById(selectedTraining.uuid, token);

            if (response.status === 200) {
                setTrainings((prevTrainings) => prevTrainings.filter((item) => item.uuid !== selectedTraining.uuid));
                setIsModalOpen(false);
            } else {
                console.error("Failed to delete training:", response.data.message || "Unknown error");
            }
        } catch (err) {
            console.error("Error deleting training:", err);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando capacitaciones...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary">
                    Sección <span className="text-secondary">capacitaciones</span>
                </h1>
                <button
                    onClick={handleNewOpen}
                    className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
                >
                    <FaPlus />
                    <span>Nueva capacitación</span>
                </button>
            </div>

            {trainings.length === 0 ? (
                <p className="text-center text-gray-500">Sin capacitaciones creadas aún</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">Fecha</th>
                                <th className="p-4 text-sm font-medium text-gray-500 w-7/12">Título</th>
                                <th className="p-4 text-sm font-medium text-gray-500 text-center w-3/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainings.map((item, index) => (
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
            )}

            {/* Pagination */}
            {trainings.length > 0 && (
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
            <DeleteTrainingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={handleDeleteConfirm}
                trainingTitle={selectedTraining?.title}
            />
        </div>
    );
};

export default BackOfficeTrainings;
