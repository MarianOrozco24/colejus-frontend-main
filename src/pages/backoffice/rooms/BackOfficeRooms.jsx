import React, { useState, useEffect, useCallback } from 'react';
import { hasPermission } from '../../../utils/hasPermission';
import {
    FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaDoorOpen,
    FaToggleOn, FaToggleOff, FaSpinner, FaExclamationTriangle
} from 'react-icons/fa';

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000/api').replace('localhost', '127.0.0.1');

const BackOfficeRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [saving, setSaving] = useState(false);

    // Confirm delete
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Form data
    const [form, setForm] = useState({
        name: '',
        capacity: '',
        price: '',
        image: '',
        description: '',
        amenities: [],
        is_active: true
    });
    const [newAmenity, setNewAmenity] = useState('');

    const canManage = hasPermission('manage_rooms');
    const token = localStorage.getItem('authToken');

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${BACKEND_URL}/rooms/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRooms(data);
            } else {
                const errData = await res.json();
                setError(errData.error || errData.message || 'Error al cargar las salas.');
            }
        } catch (err) {
            setError('Error de conexión al cargar las salas.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    useEffect(() => {
        if (successMsg) {
            const t = setTimeout(() => setSuccessMsg(''), 4000);
            return () => clearTimeout(t);
        }
    }, [successMsg]);

    const resetForm = () => {
        setForm({ name: '', capacity: '', price: '', image: '', description: '', amenities: [], is_active: true });
        setNewAmenity('');
        setEditingRoom(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (room) => {
        setEditingRoom(room);
        setForm({
            name: room.name || '',
            capacity: room.capacity || '',
            price: room.price || '',
            image: room.image || '',
            description: room.description || '',
            amenities: room.amenities || [],
            is_active: room.is_active
        });
        setNewAmenity('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const addAmenity = () => {
        const trimmed = newAmenity.trim();
        if (trimmed && !form.amenities.includes(trimmed)) {
            setForm({ ...form, amenities: [...form.amenities, trimmed] });
        }
        setNewAmenity('');
    };

    const removeAmenity = (idx) => {
        setForm({ ...form, amenities: form.amenities.filter((_, i) => i !== idx) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            name: form.name,
            capacity: form.capacity,
            price: parseFloat(form.price),
            image: form.image,
            description: form.description,
            amenities: form.amenities,
            is_active: form.is_active
        };

        try {
            const url = editingRoom
                ? `${BACKEND_URL}/rooms/${editingRoom.id}`
                : `${BACKEND_URL}/rooms`;
            const method = editingRoom ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccessMsg(editingRoom ? 'Sala actualizada correctamente.' : 'Sala creada correctamente.');
                closeModal();
                fetchRooms();
            } else {
                const errData = await res.json();
                setError(errData.error || 'Error al guardar la sala.');
            }
        } catch (err) {
            setError('Error de conexión al guardar la sala.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (roomId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/rooms/${roomId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSuccessMsg('Sala desactivada correctamente.');
                setDeleteConfirm(null);
                fetchRooms();
            } else {
                const errData = await res.json();
                setError(errData.error || 'Error al eliminar la sala.');
            }
        } catch (err) {
            setError('Error de conexión al eliminar la sala.');
        }
    };

    const handleToggleActive = async (room) => {
        try {
            const res = await fetch(`${BACKEND_URL}/rooms/${room.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !room.is_active })
            });
            if (res.ok) {
                setSuccessMsg(`Sala ${room.is_active ? 'desactivada' : 'activada'} correctamente.`);
                fetchRooms();
            }
        } catch (err) {
            setError('Error de conexión.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-3xl text-secondary" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
                        <FaDoorOpen className="text-secondary" /> Salas de Coworking
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Gestiona las salas y servicios disponibles para reserva.</p>
                </div>
                {canManage && (
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-secondary hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
                    >
                        <FaPlus /> Nueva Sala
                    </button>
                )}
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-bold mb-4 text-sm flex items-center gap-2">
                    <FaExclamationTriangle /> {error}
                </div>
            )}
            {successMsg && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 font-bold mb-4 text-sm flex items-center gap-2">
                    <FaCheck /> {successMsg}
                </div>
            )}

            {/* Rooms Grid */}
            {rooms.length === 0 ? (
                <div className="text-center text-gray-400 py-16 bg-white rounded-2xl border border-gray-100">
                    <FaDoorOpen className="text-5xl mx-auto mb-4 opacity-40" />
                    <p className="font-bold">No hay salas registradas.</p>
                    <p className="text-xs mt-1">Crea la primera sala para que aparezca en la página de Coworking.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map(room => (
                        <div
                            key={room.id}
                            className={`bg-white rounded-2xl overflow-hidden shadow-md border transition-all hover:shadow-lg ${!room.is_active ? 'opacity-60 border-red-200' : 'border-gray-100'}`}
                        >
                            {/* Image */}
                            <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                                {room.image ? (
                                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <FaDoorOpen className="text-4xl text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${room.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {room.is_active ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                                <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                                    ${room.price} / hs
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-serif font-bold text-primary mb-1">{room.name}</h3>
                                <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-2">Capacidad: {room.capacity}</p>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{room.description || 'Sin descripción.'}</p>

                                {/* Amenities */}
                                {room.amenities && room.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {room.amenities.map((a, i) => (
                                            <span key={i} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md font-medium border">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                {canManage && (
                                    <div className="flex items-center gap-2 pt-3 border-t">
                                        <button
                                            onClick={() => openEditModal(room)}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
                                        >
                                            <FaEdit /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(room)}
                                            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${room.is_active ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                                            title={room.is_active ? 'Desactivar' : 'Activar'}
                                        >
                                            {room.is_active ? <FaToggleOff /> : <FaToggleOn />}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(room.id)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
                                            title="Desactivar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Delete Confirm */}
                            {deleteConfirm === room.id && (
                                <div className="px-5 pb-4">
                                    <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center">
                                        <p className="text-xs text-red-700 font-bold mb-2">¿Desactivar esta sala?</p>
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleDelete(room.id)}
                                                className="px-4 py-1.5 bg-red-600 text-white text-xs rounded-lg font-bold hover:bg-red-700 transition-all"
                                            >
                                                Confirmar
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="px-4 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg font-bold hover:bg-gray-300 transition-all"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-primary p-5 text-white flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                {editingRoom ? <FaEdit /> : <FaPlus />}
                                {editingRoom ? 'Editar Sala' : 'Nueva Sala'}
                            </h3>
                            <button onClick={closeModal} className="text-white/80 hover:text-white transition-colors">
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">Nombre de la Sala *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ej: Sala de Reuniones Ejecutiva"
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            {/* Capacity & Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-gray-700">Capacidad *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: 10 personas"
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm"
                                        value={form.capacity}
                                        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-gray-700">Precio por Hora *</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Ej: 1500"
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">URL de Imagen</label>
                                <input
                                    type="text"
                                    placeholder="Ej: /meeting_room_exec.png"
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm"
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">Descripción</label>
                                <textarea
                                    rows="3"
                                    placeholder="Descripción detallada de la sala..."
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            {/* Amenities */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">Amenities</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ej: Wi-Fi de Alta Velocidad"
                                        className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm"
                                        value={newAmenity}
                                        onChange={(e) => setNewAmenity(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addAmenity();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addAmenity}
                                        className="px-4 py-2 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                {form.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {form.amenities.map((a, i) => (
                                            <span
                                                key={i}
                                                className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border"
                                            >
                                                {a}
                                                <button
                                                    type="button"
                                                    onClick={() => removeAmenity(i)}
                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <FaTimes size={10} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border">
                                <span className="text-sm font-bold text-gray-700">Sala Activa</span>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                                    className={`text-2xl transition-colors ${form.is_active ? 'text-green-500' : 'text-gray-400'}`}
                                >
                                    {form.is_active ? <FaToggleOn /> : <FaToggleOff />}
                                </button>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                                >
                                    {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                    {editingRoom ? 'Guardar Cambios' : 'Crear Sala'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackOfficeRooms;
