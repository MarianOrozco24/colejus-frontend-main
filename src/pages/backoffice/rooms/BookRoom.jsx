import React, { useState, useEffect, useCallback } from 'react';
import { hasPermission } from '../../../utils/hasPermission';
import {
    FaUsers, FaWifi, FaTv, FaCalendarAlt, FaClock, FaArrowLeft,
    FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaIdCard,
    FaPrint, FaChevronRight, FaVolumeUp, FaVideo, FaInfoCircle,
    FaSpinner, FaPlus, FaEdit, FaTrash, FaTimes, FaCheck,
    FaToggleOn, FaToggleOff, FaExclamationTriangle
} from 'react-icons/fa';

// Map amenity text keywords to icons
const getAmenityIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('wi-fi') || lower.includes('wifi')) return <FaWifi className="mr-2" />;
    if (lower.includes('tv') || lower.includes('pantalla') || lower.includes('proyector')) return <FaTv className="mr-2" />;
    if (lower.includes('audio') || lower.includes('micrófono') || lower.includes('microfono')) return <FaVolumeUp className="mr-2" />;
    if (lower.includes('video') || lower.includes('cámara') || lower.includes('camara')) return <FaVideo className="mr-2" />;
    if (lower.includes('capacidad') || lower.includes('personas') || lower.includes('directorio')) return <FaUsers className="mr-2" />;
    if (lower.includes('escritorio') || lower.includes('individual')) return <FaUser className="mr-2" />;
    return <FaInfoCircle className="mr-2" />;
};

// Horarios desde las 8:00 hasta las 20:00
const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
});

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000/api').replace('localhost', '127.0.0.1');

const BookRoom = () => {
    const [step, setStep] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);

    // Dynamic rooms from API
    const [roomsData, setRoomsData] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(true);

    // API loading / error states
    const [apiLoading, setApiLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [idempotencyKey, setIdempotencyKey] = useState('');

    // Booking form data (pre-filled with logged-in user)
    const [formData, setFormData] = useState({
        name: localStorage.getItem("username") || '',
        email: localStorage.getItem("email") || '',
        phone: '',
        tuition: '',
        purpose: ''
    });

    const [ticketNumber, setTicketNumber] = useState('');

    // Room CRUD modal states
    const [showCRUDModal, setShowCRUDModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [savingRoom, setSavingRoom] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Room CRUD form data
    const [roomForm, setRoomForm] = useState({
        name: '',
        capacity: '',
        price: '',
        image: '',
        description: '',
        amenities: [],
        is_active: true
    });
    const [newAmenity, setNewAmenity] = useState('');

    // Permissions
    const canViewAllRooms = hasPermission('view_rooms');
    const canManageRooms = hasPermission('manage_rooms');
    const token = localStorage.getItem('authToken');

    // Fetch rooms from API (loads active or all based on permissions)
    const fetchRooms = useCallback(async () => {
        setRoomsLoading(true);
        setError('');
        try {
            const url = canViewAllRooms ? `${BACKEND_URL}/rooms/all` : `${BACKEND_URL}/rooms`;
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const res = await fetch(url, { headers });
            
            if (res.ok) {
                const data = await res.json();
                setRoomsData(data);
            } else {
                const errData = await res.json();
                setError(errData.error || 'No se pudieron cargar las salas disponibles.');
            }
        } catch (err) {
            setError('Error de conexión al cargar las salas.');
            console.error(err);
        } finally {
            setRoomsLoading(false);
        }
    }, [canViewAllRooms, token]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // Initial default booking date: tomorrow
    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    // Load actual booked slots when changing room or date
    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            if (selectedRoom && selectedDate) {
                setApiLoading(true);
                setError('');
                try {
                    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                    const response = await fetch(
                        `${BACKEND_URL}/bookings/occupied?room_id=${selectedRoom.id}&date=${selectedDate}`,
                        { headers }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setBookedSlots(data);
                    } else {
                        const errData = await response.json();
                        setError(errData.error || 'No se pudieron cargar los horarios ocupados.');
                    }
                } catch (err) {
                    setError('Error de conexión al cargar la disponibilidad.');
                    console.error(err);
                } finally {
                    setApiLoading(false);
                }
                setSelectedSlots([]);
            }
        };
        fetchOccupiedSlots();
    }, [selectedRoom, selectedDate, token]);

    const handleRoomSelect = (room) => {
        if (!room.is_active) return;
        setSelectedRoom(room);
        setStep(2);
    };

    const handleSlotClick = (slot) => {
        if (bookedSlots.includes(slot) || apiLoading) return;

        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter(s => s !== slot));
        } else {
            setSelectedSlots([...selectedSlots, slot].sort());
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setApiLoading(true);
        setError('');

        let currentKey = idempotencyKey;
        if (!currentKey) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            currentKey = `${selectedRoom.id}-${selectedDate}-${formData.tuition}-${randomNum}`;
            setIdempotencyKey(currentKey);
        }

        try {
            const response = await fetch(`${BACKEND_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    room_id: selectedRoom.id,
                    booking_date: selectedDate,
                    time_slots: selectedSlots,
                    user_name: formData.name,
                    user_email: formData.email,
                    user_phone: formData.phone,
                    user_tuition: formData.tuition,
                    purpose: formData.purpose,
                    idempotency_key: currentKey
                })
            });

            const data = await response.json();

            if (response.ok) {
                const firstId = data.bookings && data.bookings[0] ? data.bookings[0].id : Math.floor(100 + Math.random() * 900);
                const dateCode = selectedDate.replace(/-/g, '').substring(2, 6);
                setTicketNumber(`CW-${dateCode}-${firstId}`);
                setStep(4);
            } else {
                setError(data.error || 'Ocurrió un error al procesar tu reserva.');
            }
        } catch (err) {
            setError('Error de conexión al procesar la reserva. Por favor intenta nuevamente.');
            console.error(err);
        } finally {
            setApiLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!selectedRoom) return 0;
        return selectedRoom.price * selectedSlots.length;
    };

    const handlePrint = () => {
        window.print();
    };

    // Room CRUD Handlers
    const resetRoomForm = () => {
        setRoomForm({
            name: '',
            capacity: '',
            price: '',
            image: '',
            description: '',
            amenities: [],
            is_active: true
        });
        setNewAmenity('');
        setEditingRoom(null);
    };

    const openCreateModal = () => {
        resetRoomForm();
        setShowCRUDModal(true);
    };

    const openEditModal = (room, e) => {
        e.stopPropagation(); // Avoid selecting room for booking
        setEditingRoom(room);
        setRoomForm({
            name: room.name || '',
            capacity: room.capacity || '',
            price: room.price || '',
            image: room.image || '',
            description: room.description || '',
            amenities: room.amenities || [],
            is_active: room.is_active
        });
        setNewAmenity('');
        setShowCRUDModal(true);
    };

    const closeCRUDModal = () => {
        setShowCRUDModal(false);
        resetRoomForm();
    };

    const addAmenity = () => {
        const trimmed = newAmenity.trim();
        if (trimmed && !roomForm.amenities.includes(trimmed)) {
            setRoomForm({ ...roomForm, amenities: [...roomForm.amenities, trimmed] });
        }
        setNewAmenity('');
    };

    const removeAmenity = (idx) => {
        setRoomForm({ ...roomForm, amenities: roomForm.amenities.filter((_, i) => i !== idx) });
    };

    const handleRoomFormSubmit = async (e) => {
        e.preventDefault();
        setSavingRoom(true);
        setError('');
        setSuccessMsg('');

        const payload = {
            name: roomForm.name,
            capacity: roomForm.capacity,
            price: parseFloat(roomForm.price),
            image: roomForm.image,
            description: roomForm.description,
            amenities: roomForm.amenities,
            is_active: roomForm.is_active
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
                closeCRUDModal();
                fetchRooms();
                // Clear success message after 4s
                setTimeout(() => setSuccessMsg(''), 4000);
            } else {
                const errData = await res.json();
                setError(errData.error || 'Error al guardar la sala.');
            }
        } catch (err) {
            setError('Error de conexión al guardar la sala.');
        } finally {
            setSavingRoom(false);
        }
    };

    const handleRoomDelete = async (roomId, e) => {
        e.stopPropagation();
        setError('');
        setSuccessMsg('');
        try {
            const res = await fetch(`${BACKEND_URL}/rooms/${roomId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSuccessMsg('Sala eliminada correctamente.');
                setDeleteConfirm(null);
                fetchRooms();
                setTimeout(() => setSuccessMsg(''), 4000);
            } else {
                const errData = await res.json();
                setError(errData.error || 'Error al eliminar la sala.');
            }
        } catch (err) {
            setError('Error de conexión al eliminar la sala.');
        }
    };

    const handleToggleActiveRoom = async (room, e) => {
        e.stopPropagation();
        setError('');
        setSuccessMsg('');
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
                setTimeout(() => setSuccessMsg(''), 4000);
            } else {
                const errData = await res.json();
                setError(errData.error || 'Error al modificar estado.');
            }
        } catch (err) {
            setError('Error de conexión.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto font-lato">
            {/* Header section with optional Create Room button */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
                        <FaCalendarAlt className="text-secondary" /> Reservar Sala de Coworking
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Elegí la sala, fecha y horarios para registrar tu reserva.</p>
                </div>
                {canManageRooms && step === 1 && (
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-secondary hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
                    >
                        <FaPlus /> Nueva Sala
                    </button>
                )}
            </div>

            {/* Notification Alerts */}
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

            {/* Stepper Navigation */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
                <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-8 no-print">
                    <div className={`flex items-center gap-2 text-sm font-bold ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all ${step >= 1 ? 'bg-primary scale-105 shadow-md' : 'bg-gray-300'}`}>1</span>
                        <span className="hidden sm:inline">Seleccionar Sala</span>
                    </div>
                    <FaChevronRight className="text-gray-400 text-xs" />
                    <div className={`flex items-center gap-2 text-sm font-bold ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all ${step >= 2 ? 'bg-primary scale-105 shadow-md' : 'bg-gray-300'}`}>2</span>
                        <span className="hidden sm:inline">Fecha y Horarios</span>
                    </div>
                    <FaChevronRight className="text-gray-400 text-xs" />
                    <div className={`flex items-center gap-2 text-sm font-bold ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all ${step >= 3 ? 'bg-primary scale-105 shadow-md' : 'bg-gray-300'}`}>3</span>
                        <span className="hidden sm:inline">Tus Datos</span>
                    </div>
                    <FaChevronRight className="text-gray-400 text-xs" />
                    <div className={`flex items-center gap-2 text-sm font-bold ${step >= 4 ? 'text-primary' : 'text-gray-400'}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all ${step >= 4 ? 'bg-green-600 scale-105 shadow-md' : 'bg-gray-300'}`}>4</span>
                        <span className="hidden sm:inline">Confirmación</span>
                    </div>
                </div>

                {/* Step 1: Select Room */}
                {step === 1 && (
                    roomsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <FaSpinner className="animate-spin text-4xl text-secondary mb-4" />
                            <span className="text-sm font-bold text-gray-500">Cargando salas disponibles...</span>
                        </div>
                    ) : roomsData.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p className="font-bold text-lg">No hay salas disponibles actualmente.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {roomsData.map(room => (
                                <div
                                    key={room.id}
                                    className={`bg-white rounded-2xl overflow-hidden shadow-md border transition-all duration-350 flex flex-col group ${
                                        !room.is_active ? 'opacity-65 border-red-200 shadow-inner' : 'border-gray-150 hover:shadow-xl'
                                    }`}
                                >
                                    <div className="relative h-52 overflow-hidden bg-slate-100">
                                        {room.image ? (
                                            <img
                                                src={room.image}
                                                alt={room.name}
                                                className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <FaCalendarAlt className="text-4xl text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                            ${room.price} / hs
                                        </div>
                                        {!room.is_active && (
                                            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md uppercase">
                                                Inactiva
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-serif font-bold text-primary mb-1">{room.name}</h3>
                                            <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-3">Capacidad: {room.capacity}</p>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{room.description}</p>

                                            {room.amenities && room.amenities.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    {room.amenities.map((item, idx) => {
                                                        const text = typeof item === 'string' ? item : item.text;
                                                        return (
                                                            <span key={idx} className="bg-slate-50 text-slate-700 text-[10px] px-2.5 py-1 rounded-md font-semibold border flex items-center">
                                                                {getAmenityIcon(text)}
                                                                {text}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleRoomSelect(room)}
                                                disabled={!room.is_active}
                                                className={`w-full py-2.5 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm ${
                                                    room.is_active
                                                        ? 'bg-primary hover:bg-secondary text-white hover:shadow'
                                                        : 'bg-gray-150 text-gray-400 cursor-not-allowed shadow-none'
                                                }`}
                                            >
                                                {room.is_active ? 'Reservar esta sala' : 'No disponible'} <FaChevronRight className="text-[10px]" />
                                            </button>

                                            {canManageRooms && (
                                                <div className="flex items-center gap-2 pt-2 border-t mt-2">
                                                    <button
                                                        onClick={(e) => openEditModal(room, e)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100"
                                                    >
                                                        <FaEdit /> Editar
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleToggleActiveRoom(room, e)}
                                                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                                                            room.is_active
                                                                ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-100'
                                                                : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                                                        }`}
                                                        title={room.is_active ? 'Desactivar' : 'Activar'}
                                                    >
                                                        {room.is_active ? <FaToggleOff /> : <FaToggleOn />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirm(room.id);
                                                        }}
                                                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-all border border-red-100"
                                                        title="Eliminar"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            )}

                                            {deleteConfirm === room.id && (
                                                <div className="pt-2">
                                                    <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center">
                                                        <p className="text-xs text-red-700 font-bold mb-2">¿Eliminar sala definitivamente?</p>
                                                        <div className="flex gap-2 justify-center">
                                                            <button
                                                                onClick={(e) => handleRoomDelete(room.id, e)}
                                                                className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg font-bold hover:bg-red-700 transition-all"
                                                            >
                                                                Confirmar
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDeleteConfirm(null);
                                                                }}
                                                                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg font-bold hover:bg-gray-300 transition-all"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Step 2: Date and Horarios */}
                {step === 2 && selectedRoom && (
                    <div className="relative overflow-hidden">
                        {apiLoading && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-30">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-bold text-primary">Cargando horarios...</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleBack}
                                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                                >
                                    <FaArrowLeft />
                                </button>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-primary">{selectedRoom.name}</h3>
                                    <p className="text-sm text-gray-500">Paso 2: Elegir fecha y bloque horario</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-gray-400 block uppercase">Precio por hora</span>
                                <span className="text-2xl font-extrabold text-secondary">${selectedRoom.price} ARS</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Left panel: Date Picker */}
                            <div className="md:col-span-4 space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <FaCalendarAlt className="text-secondary" /> Selecciona la Fecha
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary font-bold text-gray-700 bg-white"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border space-y-4">
                                    <h4 className="font-bold text-sm text-primary uppercase tracking-wide border-b pb-2">Resumen de Selección</h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Fecha elegida:</span>
                                        <span className="font-bold text-gray-800">{selectedDate.split('-').reverse().join('/')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Horas seleccionadas:</span>
                                        <span className="font-bold text-primary">{selectedSlots.length} hs</span>
                                    </div>
                                    {selectedSlots.length > 0 && (
                                        <div className="text-xs bg-blue-50 text-secondary p-2 rounded-lg max-h-20 overflow-y-auto">
                                            {selectedSlots.join(', ')}
                                        </div>
                                    )}
                                    <div className="border-t pt-4 flex justify-between items-end">
                                        <span className="text-sm font-bold text-gray-600">Total Estimado:</span>
                                        <span className="text-xl font-black text-secondary">${calculateTotal()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const randomNum = Math.floor(1000 + Math.random() * 9000);
                                        setIdempotencyKey(`${selectedRoom.id}-${selectedDate}-${randomNum}`);
                                        setStep(3);
                                    }}
                                    disabled={selectedSlots.length === 0 || apiLoading}
                                    className={`w-full py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                                        selectedSlots.length > 0 && !apiLoading
                                            ? 'bg-primary hover:bg-secondary text-white cursor-pointer hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    }`}
                                >
                                    Siguiente paso <FaChevronRight className="text-xs" />
                                </button>
                            </div>

                            {/* Right panel: Time Slots Grid */}
                            <div className="md:col-span-8 space-y-6">
                                <h4 className="font-bold text-gray-700 flex items-center gap-2 text-md">
                                    <FaClock className="text-secondary" /> Grilla Horaria Disponible
                                </h4>
                                <p className="text-xs text-gray-500">Puedes seleccionar múltiples bloques de una hora para extender tu reservación.</p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {timeSlots.map((slot) => {
                                        const isBooked = bookedSlots.includes(slot);
                                        const isSelected = selectedSlots.includes(slot);

                                        return (
                                            <button
                                                key={slot}
                                                onClick={() => handleSlotClick(slot)}
                                                disabled={isBooked || apiLoading}
                                                className={`py-4 rounded-xl font-bold border transition-all text-sm shadow-sm flex flex-col items-center justify-center ${
                                                    isBooked
                                                        ? 'bg-red-50 text-red-400 border-red-100 cursor-not-allowed'
                                                        : isSelected
                                                            ? 'bg-secondary text-white border-secondary scale-102 ring-2 ring-blue-300'
                                                            : 'bg-white hover:bg-slate-50 text-gray-700 border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <span>{slot}</span>
                                                <span className="text-[10px] mt-1 font-normal opacity-85">
                                                    {isBooked ? 'Ocupado' : isSelected ? 'Seleccionado' : 'Disponible'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-6 justify-center pt-4 text-xs font-bold border-t">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-md bg-white border border-gray-300 block"></span>
                                        <span className="text-gray-600">Disponible</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-md bg-secondary block"></span>
                                        <span className="text-gray-600">Tu selección</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-md bg-red-50 border border-red-100 block"></span>
                                        <span className="text-gray-600">Ocupado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: User Details Form */}
                {step === 3 && selectedRoom && (
                    <div className="max-w-3xl mx-auto relative overflow-hidden">
                        {apiLoading && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-30">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-bold text-primary">Procesando reserva...</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 border-b pb-6 mb-8">
                            <button
                                onClick={handleBack}
                                className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                            >
                                <FaArrowLeft />
                            </button>
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-primary">Detalles de Contacto</h3>
                                <p className="text-sm text-gray-500">Paso 3: Completa los datos de la reserva</p>
                            </div>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <FaUser className="text-secondary text-xs" /> Nombre Completo
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: Dra. María Pérez"
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary bg-white text-gray-700 font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <FaIdCard className="text-secondary text-xs" /> Matrícula Profesional
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: 12590"
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary bg-white text-gray-700 font-medium"
                                        value={formData.tuition}
                                        onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <FaEnvelope className="text-secondary text-xs" /> Correo Electrónico
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="Ej: maria.perez@example.com"
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary bg-white text-gray-700 font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <FaPhone className="text-secondary text-xs" /> Teléfono / WhatsApp
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="Ej: +54 260 4123456"
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary bg-white text-gray-700 font-medium"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Motivo del Uso / Observaciones</label>
                                <textarea
                                    placeholder="Detalla brevemente para qué utilizarás la sala (Ej: Audiencia, Reunión con cliente, Dictado de curso, etc.)"
                                    rows="4"
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary bg-white text-gray-700 font-medium"
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h4 className="font-bold text-primary text-sm mb-1">Detalle de Costo</h4>
                                    <p className="text-xs text-gray-500">Reserva de {selectedSlots.length} horas el {selectedDate.split('-').reverse().join('/')}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-secondary block">${calculateTotal()} ARS</span>
                                    <span className="text-[10px] text-gray-400">Pago a realizarse de forma presencial o transferencia.</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={apiLoading}
                                className="w-full py-4 bg-primary hover:bg-secondary text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer animate-fade-in"
                            >
                                Confirmar y Generar Reserva <FaCheckCircle />
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 4: Success Ticket */}
                {step === 4 && selectedRoom && (
                    <div className="max-w-2xl mx-auto animate-fade-in print-ticket-container">
                        <div className="text-center mb-8 no-print">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4 shadow-inner">
                                <FaCheckCircle size={32} />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-gray-800">¡Reserva Registrada Exitosamente!</h3>
                            <p className="text-gray-500 mt-2">Hemos enviado una confirmación a tu correo. A continuación tienes tu ticket de reserva.</p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 relative">
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 border-t border-dashed border-gray-300 z-10"></div>
                            <div className="absolute left-0 -ml-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 border-r border-gray-200 z-20"></div>
                            <div className="absolute right-0 -mr-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 border-l border-gray-200 z-20"></div>

                            <div className="p-8 bg-gradient-to-br from-primary to-slate-900 text-white pb-12">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <img src="/logo-colegio.png" alt="Colegio Logo" className="h-9 w-auto mb-2 object-contain" />
                                        <span className="text-[10px] tracking-widest text-slate-300 font-bold uppercase block">San Rafael • Mendoza</span>
                                    </div>
                                    <div className="bg-white/10 px-4 py-2 rounded-xl text-right backdrop-blur-sm border border-white/10">
                                        <span className="text-[9px] text-yellow-500 uppercase block font-bold">Código Único</span>
                                        <span className="font-mono font-black text-sm tracking-wider">{ticketNumber}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-slate-300 font-semibold block uppercase tracking-wider">Sala Seleccionada</span>
                                    <h4 className="text-2xl font-serif font-bold leading-tight">{selectedRoom.name}</h4>
                                </div>
                            </div>

                            <div className="p-8 pt-12 space-y-6 text-gray-800">
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-b pb-6 text-sm">
                                    <div>
                                        <span className="text-xs text-gray-400 block uppercase">Profesional</span>
                                        <span className="font-bold text-slate-700">{formData.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block uppercase">Matrícula</span>
                                        <span className="font-bold text-slate-700">Mat. {formData.tuition}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block uppercase">Fecha de Reserva</span>
                                        <span className="font-bold text-slate-700">{selectedDate.split('-').reverse().join('/')}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block uppercase">Bloques Reservados</span>
                                        <span className="font-bold text-secondary">{selectedSlots.length} horas ({selectedSlots.length} slots)</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-xs text-gray-400 block uppercase mb-1">Horarios Detallados</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedSlots.map(slot => (
                                                <span key={slot} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-bold text-xs border">
                                                    {slot}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {formData.purpose && (
                                        <div>
                                            <span className="text-xs text-gray-400 block uppercase">Detalles / Motivo</span>
                                            <p className="text-xs text-gray-600 font-medium italic mt-1 bg-slate-50 p-2.5 rounded-lg border border-dashed">{formData.purpose}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-6 flex justify-between items-center bg-slate-50 -mx-8 -mb-8 p-8 rounded-b-3xl">
                                    <div>
                                        <span className="text-xs text-gray-400 block uppercase">Total a Abonar</span>
                                        <span className="text-3xl font-black text-primary">${calculateTotal()}</span>
                                    </div>
                                    <div className="text-right text-[10px] text-gray-400 leading-relaxed font-bold">
                                        * Presentarse 10 min antes.<br />
                                        * Sujeto a normas de convivencia de sala.<br />
                                        * Teléfono: +54 260 4123456.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 no-print justify-center">
                            <button
                                onClick={handlePrint}
                                className="px-6 py-3.5 bg-secondary hover:bg-opacity-95 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaPrint /> Imprimir Ticket
                            </button>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSelectedRoom(null);
                                    setSelectedSlots([]);
                                    setFormData({
                                        name: localStorage.getItem("username") || '',
                                        email: localStorage.getItem("email") || '',
                                        phone: '',
                                        tuition: '',
                                        purpose: ''
                                    });
                                    setError('');
                                    setIdempotencyKey('');
                                }}
                                className="px-6 py-3.5 bg-primary hover:bg-opacity-95 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Realizar Nueva Reserva
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Room CRUD Modal */}
            {showCRUDModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in no-print">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100">
                        {/* Modal Header */}
                        <div className="bg-primary p-5 text-white flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                {editingRoom ? <FaEdit /> : <FaPlus />}
                                {editingRoom ? 'Editar Sala de Coworking' : 'Nueva Sala de Coworking'}
                            </h3>
                            <button onClick={closeCRUDModal} className="text-white/80 hover:text-white transition-colors focus:outline-none">
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleRoomFormSubmit} className="p-6 space-y-5">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">Nombre de la Sala *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ej: Sala de Reuniones Ejecutiva"
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm bg-white text-gray-700"
                                    value={roomForm.name}
                                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
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
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm bg-white text-gray-700"
                                        value={roomForm.capacity}
                                        onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
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
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm bg-white text-gray-700"
                                        value={roomForm.price}
                                        onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">URL de Imagen / Ruta</label>
                                <input
                                    type="text"
                                    placeholder="Ej: /meeting_room_exec.png"
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm bg-white text-gray-700"
                                    value={roomForm.image}
                                    onChange={(e) => setRoomForm({ ...roomForm, image: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">Descripción</label>
                                <textarea
                                    rows="3"
                                    placeholder="Descripción detallada de la sala, comodidades y usos ideales..."
                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm bg-white text-gray-700"
                                    value={roomForm.description}
                                    onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                                />
                            </div>

                            {/* Amenities */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">Amenities</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ej: Wi-Fi de Alta Velocidad"
                                        className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm bg-white text-gray-700"
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
                                        className="px-4 py-2 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all focus:outline-none"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                {roomForm.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {roomForm.amenities.map((a, i) => (
                                            <span
                                                key={i}
                                                className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200"
                                            >
                                                {a}
                                                <button
                                                    type="button"
                                                    onClick={() => removeAmenity(i)}
                                                    className="text-red-400 hover:text-red-600 transition-colors focus:outline-none"
                                                >
                                                    <FaTimes size={10} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="text-sm font-bold text-gray-700">Sala Activa (Disponible para reservas)</span>
                                <button
                                    type="button"
                                    onClick={() => setRoomForm({ ...roomForm, is_active: !roomForm.is_active })}
                                    className={`text-2xl transition-colors focus:outline-none ${roomForm.is_active ? 'text-green-500' : 'text-gray-400'}`}
                                >
                                    {roomForm.is_active ? <FaToggleOn /> : <FaToggleOff />}
                                </button>
                            </div>

                            {/* Submit / Cancel Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={savingRoom}
                                    className="flex-1 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-60 focus:outline-none"
                                >
                                    {savingRoom ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                    {editingRoom ? 'Guardar Cambios' : 'Crear Sala'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeCRUDModal}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all text-sm focus:outline-none"
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

export default BookRoom;
