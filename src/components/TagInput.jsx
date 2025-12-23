import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaPlus, FaTimes, FaCheck } from 'react-icons/fa';
import { fetchTagsByName } from '../api/tags/fetchTagsByName';
import { createTag } from '../api/tags/postTag';

const TagInput = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    const [newTagColor, setNewTagColor] = useState("#3B82F6");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
                setIsCreating(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize from value (array of tag objects)
    useEffect(() => {
        if (value && Array.isArray(value)) {
            setSelectedTags(value);
        }
    }, [value]);

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetchTagsByName(token, { parameter: searchValue });
                if (response.status === 200) {
                    setAvailableTags(response.data.tags);
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
            setLoading(false);
        };

        const debounceTimer = setTimeout(() => {
            fetchTags();
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchValue]);

    const handleSelect = (tag) => {
        if (!selectedTags.find(t => t.uuid === tag.uuid)) {
            const newSelectedTags = [...selectedTags, tag];
            setSelectedTags(newSelectedTags);
            onChange(newSelectedTags); // Pass back full tag objects
        }
        setOpen(false);
        setSearchValue('');
    };

    const handleCreateTag = async () => {
        if (!searchValue) return;

        setError("");
        setLoading(true);
        const token = localStorage.getItem('authToken');

        try {
            const response = await createTag({
                name: searchValue,
                color: newTagColor
            }, token);

            if (response.status === 201) {
                handleSelect(response.data);
                setIsCreating(false);
            } else {
                setError(response.data.message || 'Error al crear la etiqueta');
            }
        } catch (error) {
            setError('Error al crear la etiqueta');
            console.error('Error creating tag:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeTag = (tag) => {
        const newSelectedTags = selectedTags.filter(t => t.uuid !== tag.uuid);
        setSelectedTags(newSelectedTags);
        onChange(newSelectedTags); // Pass back full tag objects
    };
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full px-4 py-2 text-left border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                        {selectedTags.length > 0 ? `${selectedTags.length} etiquetas seleccionadas` : 'Seleccionar o crear etiquetas...'}
                    </span>
                    <FaChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'transform rotate-180' : ''}`} />
                </div>
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Buscar etiqueta..."
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                Cargando...
                            </div>
                        ) : isCreating ? (
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Crear nueva etiqueta</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Color</label>
                                        <input
                                            type="color"
                                            value={newTagColor}
                                            onChange={(e) => setNewTagColor(e.target.value)}
                                            className="w-full h-8 p-1 rounded-md cursor-pointer"
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleCreateTag}
                                            disabled={loading}
                                            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {loading ? 'Creando...' : 'Crear'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : availableTags.length > 0 ? (
                            <div className="py-1">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag.uuid}
                                        onClick={() => handleSelect(tag)}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between group"
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: tag.color || '#E5E7EB' }}
                                            />
                                            <span>{tag.name}</span>
                                        </div>
                                        {selectedTags.find(t => t.uuid === tag.uuid) ? (
                                            <FaCheck className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <FaCheck className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-50" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-gray-500 mb-2">No se encontraron etiquetas</p>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
                                >
                                    <FaPlus className="w-3 h-3 mr-2" />
                                    Crear "{searchValue}"
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                    <span
                        key={tag.uuid}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: tag.color || '#E5E7EB' }}
                        />
                        {tag.name}
                        <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 focus:outline-none hover:text-red-500"
                        >
                            <FaTimes className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagInput;