import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchAllTags } from '../../../api/tags/fetchAllTags';
import { createTag } from '../../../api/tags/postTag';
import { editTagById } from '../../../api/tags/editTagById';
import { deleteTagById } from '../../../api/tags/deleteTagById';

const BackOfficeTags = () => {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState("");
    const [color, setColor] = useState("#000000");
    const [editingTag, setEditingTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetchAllTags(token);
                if (response.status === 200) {
                    setTags(response.data.tags);
                } else {
                    setError("Error al cargar las categorías");
                }
            } catch (err) {
                console.error(err);
                setError("Error de conexión");
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        try {
            const token = localStorage.getItem("authToken");
            const response = await createTag({ name: newTagName, color: color }, token);

            if (response.status === 201) {
                setTags([...tags, response.data]);
                setNewTagName("");
                setColor("");
            } else {
                console.error("Error creating tag:", response.data.message);
            }
        } catch (err) {
            console.error("Error creating tag:", err);
        }
    };

    const handleUpdateTag = async (uuid, name, color) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await editTagById({ name, color }, uuid, token);

            if (response.status === 200) {
                setTags(
                    tags.map((tag) => (tag.uuid === uuid ? { ...tag, name, color } : tag))
                );
                setEditingTag(null);
            } else {
                console.error("Error updating tag:", response.data.message);
            }
        } catch (err) {
            console.error("Error updating tag:", err);
        }
    };

    const handleDeleteClick = (tag) => {
        setTagToDelete(tag);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await deleteTagById(tagToDelete.uuid, token);

            if (response.status === 200) {
                setTags(tags.filter((tag) => tag.uuid !== tagToDelete.uuid));
                setIsDeleteModalOpen(false);
                setTagToDelete(null);
            } else {
                console.error("Error deleting tag:", response.data.message);
            }
        } catch (err) {
            console.error("Error deleting tag:", err);
        }
    };

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary">
                    Creación de <span className="text-secondary">categorías</span>
                </h1>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Nombre de categoría"
                        className="w-64 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <input
                        type="color"
                        className="w-12 h-12 border rounded-lg cursor-pointer appearance-none"
                        onChange={(e) => { setColor(e.target.value); }}
                    />
                    <button
                        onClick={handleCreateTag}
                        className="flex items-center px-4 py-2 bg-secondary text-white rounded-full shadow hover:bg-secondary-dark"
                    >
                        <FaPlus className="mr-2" />
                        <span>Nueva categoría</span>
                    </button>
                </div>
            </div>

            {tags.length === 0 ? (
                <p className="text-center text-gray-500">Sin categorías creadas aún</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {tags.map((tag) => (
                        <div
                            key={tag.uuid}
                            className="flex items-center justify-between px-4 py-2 border rounded-lg bg-gray-50 shadow"
                        >
                            <div className="flex items-center space-x-3">
                                {editingTag === tag.uuid ? (
                                    <>
                                        <input
                                            type="text"
                                            defaultValue={tag.name}
                                            onBlur={(e) => handleUpdateTag(tag.uuid, e.target.value, tag.color)}
                                            className="px-2 py-1 border rounded focus:outline-none"
                                        />
                                        <input
                                            type="color"
                                            defaultValue={tag.color}
                                            onChange={(e) => handleUpdateTag(tag.uuid, tag.name, e.target.value)}
                                            className="w-8 h-8 border rounded-full cursor-pointer"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <span className="text-gray-800 font-medium truncate">{tag.name}</span>
                                        <div
                                            className="w-5 h-5 rounded-full border"
                                            style={{ backgroundColor: tag.color }}
                                        ></div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    className="text-gray-500 hover:text-secondary"
                                    onClick={() => setEditingTag(tag.uuid)}
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="text-gray-500 hover:text-red-500"
                                    onClick={() => handleDeleteClick(tag)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar eliminación</h2>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro que deseas eliminar la categoría{" "}
                            <span className="font-semibold">{tagToDelete?.name}</span>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackOfficeTags;
