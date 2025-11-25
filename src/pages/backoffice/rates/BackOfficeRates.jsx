import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchAllRates } from "../../../api/rates/fetchAllRates";

const BackOfficeRates = () => {
    const navigate = useNavigate();
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRate, setSelectedRate] = useState(null);

    const fetchRates = async () => {
        const token = localStorage.getItem("authToken");
        setLoading(true);

        try {
            const response = await fetchAllRates(token);
            if (response.status === 200) {

                // Adjust how you access the rates
                const rates = response.data || [];
                setRates(rates);
            } else {
                setError(response.data.message || "Error al cargar las tasas");
            }
        } catch (err) {
            setError("Error de conexión");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const handleNewOpen = () => {
        navigate("/backoffice/nueva-tasa");
    };

    const handleEditOpen = (rateUuid) => {
        navigate(`/backoffice/editar-tasa/${rateUuid}`);
    };

    const handleDeleteClick = (rateItem) => {
        setSelectedRate(rateItem);
        setIsModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Actualmente';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando tasas...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-primary">
                    Sección <span className="text-secondary">tasas</span>
                </h1>
                <button
                    onClick={handleNewOpen}
                    className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
                >
                    <FaPlus />
                    <span>Nueva tasa</span>
                </button>
            </div>

            {(!rates || rates.length === 0) ? (
                <p className="text-center text-gray-500">Sin tasas creadas aún</p>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-[640px] w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">Tasa</th>
                                <th className="p-4 text-sm font-medium text-gray-500 w-3/12">Fecha Inicio</th>
                                <th className="p-4 text-sm font-medium text-gray-500 w-3/12">Fecha Fin</th>
                                <th className="p-4 text-sm font-medium text-gray-500 w-2/12">Estado</th>
                                <th className="p-4 text-sm font-medium text-gray-500 text-center w-2/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rates.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-4 text-sm text-gray-800">
                                        {parseFloat(item.rate).toFixed(4)}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {formatDate(item.start_date)}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {formatDate(item.end_date)}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${!item.end_date
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {!item.end_date ? 'Activa' : 'Histórica'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center justify-center space-x-4">
                                        <button className="text-gray-500 hover:text-secondary">
                                            <FaEdit size={20} onClick={() => handleEditOpen(item.uuid)} />
                                        </button>
                                        <button
                                            className="text-gray-500 hover:text-red-500"
                                            disabled={!item.end_date}
                                        >
                                            <FaTrash size={20} onClick={() => handleDeleteClick(item)} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    <div className="md:hidden divide-y">
                        {rates.map((item, index) => (
                            <div key={index} className="p-4 space-y-2">
                                <div className="text-sm font-semibold text-primary">
                                    {parseFloat(item.rate).toFixed(4)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Inicio: {formatDate(item.start_date)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Fin: {formatDate(item.end_date)}
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${!item.end_date
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {!item.end_date ? 'Activa' : 'Histórica'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-end gap-3 text-gray-500">
                                    <button onClick={() => handleEditOpen(item.uuid)} className="hover:text-secondary">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDeleteClick(item)} disabled={!item.end_date} className="hover:text-red-500 disabled:opacity-50">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackOfficeRates;