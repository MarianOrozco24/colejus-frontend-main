import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from '../../../utils/hasPermission';
import {
    FaUsers, FaWifi, FaTv, FaCalendarAlt, FaClock, FaArrowLeft,
    FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaIdCard,
    FaPrint, FaChevronRight, FaVolumeUp, FaVideo, FaInfoCircle,
    FaSpinner, FaPlus, FaEdit, FaTrash, FaTimes, FaCheck,
    FaToggleOn, FaToggleOff, FaExclamationTriangle, FaChartBar
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

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    if (imagePath.startsWith('/static/')) {
        const origin = BACKEND_URL.replace('/api', '');
        return `${origin}${imagePath}`;
    }
    return imagePath;
};

const BookRoom = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [step, setStep] = useState(1);

    const [profiles] = useState(() => {
        const p = localStorage.getItem("profiles");
        return p ? JSON.parse(p) : [];
    });

    const isAdminOrDev = profiles.some(p =>
        ['admin', 'administrador', 'dev'].includes((p.name || p.profile_name || '').toLowerCase())
    );
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [attendees, setAttendees] = useState(1);

    // Dynamic rooms from API
    const [roomsData, setRoomsData] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(true);

    // API loading / error states
    const [apiLoading, setApiLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [idempotencyKey, setIdempotencyKey] = useState('');
    const [hasProfessionalProfile, setHasProfessionalProfile] = useState(false);
    const [myBookingsForDate, setMyBookingsForDate] = useState([]);
    const [bookingDeleteConfirm, setBookingDeleteConfirm] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Accompanying lawyers selection states
    const [allLawyers, setAllLawyers] = useState([]);
    const [selectedCompanions, setSelectedCompanions] = useState([]);
    const [lawyerSearchTerm, setLawyerSearchTerm] = useState('');
    const [showLawyerSuggestions, setShowLawyerSuggestions] = useState(false);

    // Fetch all lawyers for companion selection
    useEffect(() => {
        const fetchLawyers = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${BACKEND_URL}/bookings/lawyers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAllLawyers(data);
                }
            } catch (err) {
                console.error("Error loading lawyers:", err);
            }
        };
        fetchLawyers();
    }, [token]);

    // Fetch user's professional profile to pre-fill booking form
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${BACKEND_URL}/professionals/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        name: data.name || prev.name,
                        email: data.email || prev.email,
                        phone: data.phone || prev.phone,
                        tuition: data.tuition || prev.tuition
                    }));
                    setHasProfessionalProfile(true);
                }
            } catch (err) {
                console.error("Error fetching my professional profile:", err);
            }
        };
        fetchProfile();
    }, [token]);

    // Fetch user's existing bookings for the selected date
    useEffect(() => {
        const fetchMyBookings = async () => {
            if (!token || !selectedDate) return;
            try {
                const res = await fetch(`${BACKEND_URL}/bookings/my-bookings?date=${selectedDate}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMyBookingsForDate(data);
                }
            } catch (err) {
                console.error("Error fetching my bookings:", err);
            }
        };
        fetchMyBookings();
    }, [selectedDate, token, refreshTrigger]);

    const addCompanion = (lawyer) => {
        if (selectedRoom && (1 + selectedCompanions.length >= selectedRoom.capacity)) {
            setError(`No puedes agregar más personas. La capacidad máxima de la sala es de ${selectedRoom.capacity} personas.`);
            return;
        }
        const updated = [...selectedCompanions, lawyer];
        setSelectedCompanions(updated);
        setAttendees(1 + updated.length);
        setLawyerSearchTerm('');
        setShowLawyerSuggestions(false);
        setError('');
    };

    const removeCompanion = (companionUuid) => {
        const updated = selectedCompanions.filter(c => c.uuid !== companionUuid);
        setSelectedCompanions(updated);
        setAttendees(1 + updated.length);
        setError('');
    };

    const filteredLawyers = allLawyers.filter(lawyer => {
        const isSelf = lawyer.email.toLowerCase() === (localStorage.getItem("email") || '').toLowerCase();
        const isAlreadySelected = selectedCompanions.some(c => c.uuid === lawyer.uuid);
        const matchesSearch = lawyer.name.toLowerCase().includes(lawyerSearchTerm.toLowerCase());
        return !isSelf && !isAlreadySelected && matchesSearch;
    });

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
        price: '0',
        image: '',
        description: '',
        amenities: [],
        is_active: true
    });
    const [newAmenity, setNewAmenity] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState('');

    // Permissions
    const canViewAllRooms = hasPermission('view_rooms');
    const canManageRooms = hasPermission('manage_rooms');

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

    // Auto-select first active room when rooms list loads, and keep selectedRoom in sync with roomsData
    useEffect(() => {
        if (roomsData.length > 0) {
            if (!selectedRoom) {
                const activeRoom = roomsData.find(r => r.is_active);
                setSelectedRoom(activeRoom || roomsData[0]);
            } else {
                const updatedRoom = roomsData.find(r => r.id === selectedRoom.id);
                if (updatedRoom) {
                    if (updatedRoom !== selectedRoom) {
                        setSelectedRoom(updatedRoom);
                    }
                } else {
                    setSelectedRoom(roomsData[0]);
                }
            }
        }
    }, [roomsData, selectedRoom]);


    // Initial default booking date: tomorrow
    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    // Load actual booked slots when changing room, date or attendees count
    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            if (selectedRoom && selectedDate) {
                setApiLoading(true);
                setError('');
                try {
                    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                    const response = await fetch(
                        `${BACKEND_URL}/bookings/occupied?room_id=${selectedRoom.id}&date=${selectedDate}&attendees=${attendees}`,
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
    }, [selectedRoom, selectedDate, attendees, token, refreshTrigger]);

    const handleRoomSelect = (room) => {
        if (!room.is_active) return;
        setSelectedRoom(room);
        if (attendees > room.capacity) {
            setAttendees(room.capacity);
        }
        setStep(2);
    };

    const handleSlotClick = (slot) => {
        if (bookedSlots.includes(slot) || apiLoading) return;

        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter(s => s !== slot));
            setError('');
        } else {
            if (selectedSlots.length >= 3) {
                setError('No puedes reservar más de 3 horas por turno.');
                return;
            }
            setSelectedSlots([...selectedSlots, slot].sort());
            setError('');
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
                    attendees: attendees,
                    companions: selectedCompanions.map(c => ({ name: c.name, email: c.email })),
                    idempotency_key: currentKey,
                    bypass_validation: localStorage.getItem("disableMembershipValidation") === "true"
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

    const executeCancelBooking = async (bookingId) => {
        setApiLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await fetch(`${BACKEND_URL}/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setSuccessMsg('Reserva cancelada correctamente.');
                setBookingDeleteConfirm(null);
                setRefreshTrigger(prev => prev + 1);
                setTimeout(() => setSuccessMsg(''), 4000);
            } else {
                const data = await res.json();
                setError(data.error || 'Error al cancelar la reserva.');
            }
        } catch (err) {
            setError('Error de conexión al cancelar la reserva.');
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        setUploadError('');

        const formDataObj = new FormData();
        formDataObj.append('image', file);

        try {
            const res = await fetch(`${BACKEND_URL}/rooms/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataObj
            });

            if (res.ok) {
                const data = await res.json();
                setRoomForm(prev => ({ ...prev, image: data.image_url }));
            } else {
                const errData = await res.json();
                setUploadError(errData.error || 'Error al subir la imagen.');
            }
        } catch (err) {
            setUploadError('Error de conexión al subir la imagen.');
            console.error(err);
        } finally {
            setUploadingImage(false);
        }
    };

    // Room CRUD Handlers
    const resetRoomForm = () => {
        setRoomForm({
            name: '',
            capacity: '',
            price: '0',
            image: '',
            description: '',
            amenities: [],
            is_active: true
        });
        setNewAmenity('');
        setEditingRoom(null);
        setUploadError('');
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
            price: room.price !== undefined ? String(room.price) : '0',
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
            price: parseFloat(roomForm.price) || 0.0,
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

    // Helper to group and format user's own bookings for display
    const renderUserBookingsWarning = () => {
        if (!myBookingsForDate || myBookingsForDate.length === 0) return null;

        // Group bookings by room name
        const bookingsByRoom = myBookingsForDate.reduce((acc, booking) => {
            const roomName = booking.room_name || 'Sala de Coworking';
            if (!acc[roomName]) {
                acc[roomName] = [];
            }
            acc[roomName].push(booking);
            return acc;
        }, {});

        return (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 font-medium mb-4 text-xs md:text-sm flex flex-col gap-2 shadow-sm animate-fade-in no-print">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                    <FaInfoCircle className="text-amber-600 text-base" />
                    <span>Ya tenés reservas registradas para esta fecha:</span>
                </div>
                <div className="space-y-2 pl-6">
                    {Object.entries(bookingsByRoom).map(([roomName, bookings]) => {
                        const sortedBookings = [...bookings].sort((a, b) => a.time_slot.localeCompare(b.time_slot));
                        const slots = sortedBookings.map(b => b.time_slot);
                        const firstBookingId = sortedBookings[0]?.id;

                        return (
                            <div key={roomName} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 last:border-b-0 pb-1.5 last:pb-0">
                                <span>
                                    • <span className="font-bold">{roomName}</span>: {slots.length} {slots.length === 1 ? 'hora' : 'horas'} ({slots.join(', ')})
                                </span>

                                {bookingDeleteConfirm === firstBookingId ? (
                                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                        <span className="text-[10px] text-red-650 font-bold">¿Cancelar?</span>
                                        <button
                                            onClick={() => executeCancelBooking(firstBookingId)}
                                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm transition-all"
                                        >
                                            Sí
                                        </button>
                                        <button
                                            onClick={() => setBookingDeleteConfirm(null)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm transition-all"
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setBookingDeleteConfirm(firstBookingId)}
                                        className="text-red-600 hover:text-red-800 font-bold transition-all text-xs flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-lg border border-red-200 shadow-sm self-end sm:self-auto"
                                        title="Cancelar esta reserva"
                                    >
                                        <FaTrash className="text-[9px]" /> Cancelar
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
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
                <div className="flex gap-2 flex-wrap items-center">
                    {isAdminOrDev && (
                        <button
                            onClick={() => navigate('/backoffice/estadisticas-salas')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-xs md:text-sm"
                            title="Estadísticas de Salas"
                        >
                            <FaChartBar /> Estadísticas
                        </button>
                    )}
                    {canManageRooms && step === 1 && (
                        <button
                            onClick={openCreateModal}
                            className="px-5 py-2.5 bg-secondary hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
                        >
                            <FaPlus /> Nueva Sala
                        </button>
                    )}
                </div>
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

                {/* Step 1: Select Room & Date */}
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
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left panel: Date Picker & Rooms List (costado) */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Date Picker & Attendees */}
                                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
                                    <div>
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
                                    {renderUserBookingsWarning()}
                                    <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaUsers className="text-secondary" /> Colegas Acompañantes
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Buscar colega por nombre..."
                                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm font-bold text-gray-700 bg-white"
                                            value={lawyerSearchTerm}
                                            onChange={(e) => {
                                                setLawyerSearchTerm(e.target.value);
                                                setShowLawyerSuggestions(true);
                                            }}
                                            onFocus={() => setShowLawyerSuggestions(true)}
                                        />

                                        {/* Suggestions Dropdown */}
                                        {showLawyerSuggestions && lawyerSearchTerm.trim() && (
                                            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                {filteredLawyers.length > 0 ? (
                                                    filteredLawyers.map(lawyer => (
                                                        <div
                                                            key={lawyer.uuid}
                                                            onClick={() => addCompanion(lawyer)}
                                                            className="p-3 hover:bg-slate-50 cursor-pointer flex flex-col border-b border-gray-50 last:border-b-0"
                                                        >
                                                            <span className="text-xs font-bold text-gray-800">{lawyer.name}</span>
                                                            <span className="text-[10px] text-gray-400">{lawyer.email}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-3 text-center text-xs text-gray-400">
                                                        No se encontraron abogados
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Click outside to close suggestion dropdown */}
                                        {showLawyerSuggestions && (
                                            <div
                                                className="fixed inset-0 z-45"
                                                onClick={() => setShowLawyerSuggestions(false)}
                                            />
                                        )}

                                        {/* Total Attendees Info */}
                                        <div className="mt-2 text-xs font-bold text-gray-500 bg-slate-100 p-2.5 rounded-lg flex justify-between items-center">
                                            <span>Asistentes totales:</span>
                                            <span className="text-primary font-black">{attendees} / {selectedRoom ? selectedRoom.capacity : 100}</span>
                                        </div>

                                        {/* Selected Companions badges */}
                                        {selectedCompanions.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Acompañantes seleccionados:</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selectedCompanions.map(companion => (
                                                        <span key={companion.uuid} className="inline-flex items-center gap-1.5 bg-blue-50 text-secondary text-xs px-2.5 py-1.5 rounded-lg font-bold border border-blue-100">
                                                            {companion.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCompanion(companion.uuid)}
                                                                className="text-gray-400 hover:text-red-500 font-bold ml-0.5 focus:outline-none"
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rooms List */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider pl-1">
                                        Salas Disponibles
                                    </h4>
                                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                                        {roomsData.map(room => {
                                            const isSelected = selectedRoom?.id === room.id;
                                            return (
                                                <div
                                                    key={room.id}
                                                    onClick={() => setSelectedRoom(room)}
                                                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${isSelected
                                                        ? 'bg-blue-50/70 border-secondary ring-1 ring-secondary shadow-sm'
                                                        : 'bg-white border-gray-200 hover:bg-slate-50'
                                                        } ${!room.is_active ? 'opacity-60' : ''}`}
                                                >
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 relative">
                                                        {room.image ? (
                                                            <img
                                                                src={getImageUrl(room.image)}
                                                                alt={room.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full bg-slate-200">
                                                                <FaCalendarAlt className="text-gray-400 text-lg" />
                                                            </div>
                                                        )}
                                                        {!room.is_active && (
                                                            <span className="absolute inset-0 bg-red-650/80 text-white text-[8px] font-extrabold flex items-center justify-center uppercase tracking-wider">
                                                                Inactiva
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h5 className="text-sm font-bold text-primary truncate">{room.name}</h5>
                                                        <p className="text-xs text-gray-500 font-semibold">Capacidad: {room.capacity} personas</p>
                                                        <p className="text-xs font-bold text-secondary mt-0.5">Incluido con Membresía</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Right panel: Active/Selected Room Details (Large view) */}
                            <div className="lg:col-span-8">
                                {selectedRoom ? (
                                    <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-md flex flex-col h-full justify-between">
                                        <div>
                                            {/* Large Room Image */}
                                            <div className="relative h-72 sm:h-96 bg-slate-100 overflow-hidden">
                                                {selectedRoom.image ? (
                                                    <img
                                                        src={getImageUrl(selectedRoom.image)}
                                                        alt={selectedRoom.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full bg-slate-200">
                                                        <FaCalendarAlt className="text-6xl text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                                    Incluido con Membresía
                                                </div>
                                                {!selectedRoom.is_active && (
                                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-lg uppercase">
                                                        Inactiva
                                                    </div>
                                                )}
                                            </div>

                                            {/* Room Details */}
                                            <div className="p-6 sm:p-8">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                                    <h3 className="text-2xl font-serif font-bold text-primary">{selectedRoom.name}</h3>
                                                    <span className="text-sm font-bold text-secondary bg-blue-50 px-3 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
                                                        Capacidad: {selectedRoom.capacity} personas
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed text-base mb-6">{selectedRoom.description}</p>

                                                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Comodidades</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedRoom.amenities.map((item, idx) => {
                                                                const text = typeof item === 'string' ? item : item.text;
                                                                return (
                                                                    <span key={idx} className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-150 flex items-center">
                                                                        {getAmenityIcon(text)}
                                                                        {text}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions & Manage panel */}
                                        <div className="p-6 sm:p-8 border-t bg-slate-50 flex flex-col gap-4">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                                                <div className="w-full sm:w-auto">
                                                    <button
                                                        onClick={() => handleRoomSelect(selectedRoom)}
                                                        disabled={!selectedRoom.is_active}
                                                        className={`w-full sm:w-auto px-8 py-3.5 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm ${selectedRoom.is_active
                                                            ? 'bg-primary hover:bg-secondary text-white hover:shadow-lg hover:scale-[1.01]'
                                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                                            }`}
                                                    >
                                                        {selectedRoom.is_active ? 'Reservar esta sala' : 'No disponible'} <FaChevronRight className="text-xs" />
                                                    </button>
                                                </div>

                                                {canManageRooms && (
                                                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                                                        <button
                                                            onClick={(e) => openEditModal(selectedRoom, e)}
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100"
                                                        >
                                                            <FaEdit /> Editar
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleToggleActiveRoom(selectedRoom, e)}
                                                            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedRoom.is_active
                                                                ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-100'
                                                                : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                                                                }`}
                                                            title={selectedRoom.is_active ? 'Desactivar' : 'Activar'}
                                                        >
                                                            {selectedRoom.is_active ? <FaToggleOff /> : <FaToggleOn />}
                                                            <span className="ml-1">{selectedRoom.is_active ? 'Desactivar' : 'Activar'}</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteConfirm(selectedRoom.id);
                                                            }}
                                                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100"
                                                            title="Eliminar"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {deleteConfirm === selectedRoom.id && (
                                                <div className="w-full">
                                                    <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-center">
                                                        <p className="text-sm text-red-700 font-bold mb-3">¿Eliminar sala definitivamente?</p>
                                                        <div className="flex gap-2 justify-center">
                                                            <button
                                                                onClick={(e) => handleRoomDelete(selectedRoom.id, e)}
                                                                className="px-4 py-2 bg-red-600 text-white text-xs rounded-lg font-bold hover:bg-red-700 transition-all"
                                                            >
                                                                Confirmar
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDeleteConfirm(null);
                                                                }}
                                                                className="px-4 py-2 bg-gray-200 text-gray-700 text-xs rounded-lg font-bold hover:bg-gray-300 transition-all"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center text-gray-400">
                                        <p className="font-bold text-lg">Selecciona una sala para ver sus detalles.</p>
                                    </div>
                                )}
                            </div>
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
                                <span className="text-2xl font-extrabold text-secondary">Sin costo adicional</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Left panel: Date Picker */}
                            <div className="md:col-span-4 space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border space-y-4">
                                    <div>
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
                                    {renderUserBookingsWarning()}
                                    <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaUsers className="text-secondary" /> Colegas Acompañantes
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Buscar colega por nombre..."
                                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm font-bold text-gray-700 bg-white"
                                            value={lawyerSearchTerm}
                                            onChange={(e) => {
                                                setLawyerSearchTerm(e.target.value);
                                                setShowLawyerSuggestions(true);
                                            }}
                                            onFocus={() => setShowLawyerSuggestions(true)}
                                        />

                                        {/* Suggestions Dropdown */}
                                        {showLawyerSuggestions && lawyerSearchTerm.trim() && (
                                            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                {filteredLawyers.length > 0 ? (
                                                    filteredLawyers.map(lawyer => (
                                                        <div
                                                            key={lawyer.uuid}
                                                            onClick={() => addCompanion(lawyer)}
                                                            className="p-3 hover:bg-slate-50 cursor-pointer flex flex-col border-b border-gray-50 last:border-b-0"
                                                        >
                                                            <span className="text-xs font-bold text-gray-800">{lawyer.name}</span>
                                                            <span className="text-[10px] text-gray-400">{lawyer.email}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-3 text-center text-xs text-gray-400">
                                                        No se encontraron abogados
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Click outside to close suggestion dropdown */}
                                        {showLawyerSuggestions && (
                                            <div
                                                className="fixed inset-0 z-45"
                                                onClick={() => setShowLawyerSuggestions(false)}
                                            />
                                        )}

                                        {/* Total Attendees Info */}
                                        <div className="mt-2 text-xs font-bold text-gray-500 bg-slate-100 p-2.5 rounded-lg flex justify-between items-center">
                                            <span>Asistentes totales:</span>
                                            <span className="text-primary font-black">{attendees} / {selectedRoom.capacity}</span>
                                        </div>

                                        {/* Selected Companions badges */}
                                        {selectedCompanions.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Acompañantes seleccionados:</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selectedCompanions.map(companion => (
                                                        <span key={companion.uuid} className="inline-flex items-center gap-1.5 bg-blue-50 text-secondary text-xs px-2.5 py-1.5 rounded-lg font-bold border border-blue-100">
                                                            {companion.name}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCompanion(companion.uuid)}
                                                                className="text-gray-400 hover:text-red-500 font-bold ml-0.5 focus:outline-none"
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border space-y-4">
                                    <h4 className="font-bold text-sm text-primary uppercase tracking-wide border-b pb-2">Resumen de Selección</h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Fecha elegida:</span>
                                        <span className="font-bold text-gray-800">{selectedDate.split('-').reverse().join('/')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Personas:</span>
                                        <span className="font-bold text-gray-800">{attendees} personas</span>
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
                                    className={`w-full py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${selectedSlots.length > 0 && !apiLoading
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
                                                className={`py-4 rounded-xl font-bold border transition-all text-sm shadow-sm flex flex-col items-center justify-center ${isBooked
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
                                        className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary font-medium transition-all ${hasProfessionalProfile
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                            : 'bg-white text-gray-700 border-gray-300'
                                            }`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        readOnly={hasProfessionalProfile}
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
                                        className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary font-medium transition-all ${hasProfessionalProfile
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                            : 'bg-white text-gray-700 border-gray-300'
                                            }`}
                                        value={formData.tuition}
                                        onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                                        readOnly={hasProfessionalProfile}
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
                                        className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary font-medium transition-all ${hasProfessionalProfile
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                            : 'bg-white text-gray-700 border-gray-300'
                                            }`}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        readOnly={hasProfessionalProfile}
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
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary font-medium transition-all bg-white text-gray-700 border-gray-300"
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
                                    <span className="text-2xl font-black text-secondary block">Bonificado</span>
                                    <span className="text-[10px] text-gray-400">Uso gratuito incluido en su membresía.</span>
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
                                        <span className="text-xs text-gray-400 block uppercase">Cantidad de Asistentes</span>
                                        <span className="font-bold text-slate-700">{attendees} personas</span>
                                    </div>
                                    {selectedCompanions.length > 0 && (
                                        <div className="col-span-2">
                                            <span className="text-xs text-gray-400 block uppercase">Colegas Acompañantes</span>
                                            <span className="font-bold text-slate-700">
                                                {selectedCompanions.map(c => c.name).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    <div className="col-span-2">
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
                                        <span className="text-3xl font-black text-primary">Sin Costo</span>
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
                                    setSelectedCompanions([]);
                                    setAttendees(1);
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
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-bold text-gray-700">Capacidad (personas) *</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        placeholder="Ej: 10"
                                        className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm bg-white text-gray-700"
                                        value={roomForm.capacity}
                                        onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || '' })}
                                    />
                                </div>
                            </div>

                            {/* Image URL / Upload */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700">Imagen de la Sala</label>
                                
                                {roomForm.image && (
                                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2 bg-slate-100 border border-slate-200 shadow-inner">
                                        <img
                                            src={getImageUrl(roomForm.image)}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setRoomForm({ ...roomForm, image: '' })}
                                            className="absolute top-2 right-2 bg-red-650 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-md flex items-center justify-center"
                                            title="Eliminar imagen"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="URL de la imagen o sube una archivo..."
                                        className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary text-sm bg-white text-gray-700"
                                        value={roomForm.image}
                                        onChange={(e) => setRoomForm({ ...roomForm, image: e.target.value })}
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-3 pb-3">
                                            {uploadingImage ? (
                                                <>
                                                    <FaSpinner className="animate-spin text-secondary text-xl mb-1" />
                                                    <p className="text-xs text-gray-500 font-semibold">Subiendo archivo...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-secondary text-lg mb-1">📁</span>
                                                    <p className="text-xs text-gray-500 font-semibold"><span className="text-secondary">Haz clic aquí</span> para subir imagen</p>
                                                    <p className="text-[10px] text-gray-400">PNG, JPG, JPEG, GIF, WEBP</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                    {uploadError && (
                                        <p className="text-xs text-red-650 font-bold mt-1">{uploadError}</p>
                                    )}
                                </div>
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
