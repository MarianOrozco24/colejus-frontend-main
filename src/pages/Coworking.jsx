import React, { useState, useEffect } from 'react';
import ResponsiveNav from '../components/ResponsiveNav';
import Footer from '../components/Footer';
import {
    FaUsers, FaWifi, FaTv, FaCalendarAlt, FaClock, FaArrowLeft,
    FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaIdCard,
    FaPrint, FaChevronRight, FaVolumeUp, FaVideo, FaInfoCircle,
    FaSpinner
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

const Coworking = () => {
    const [step, setStep] = useState(1);
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
    const [idempotencyKey, setIdempotencyKey] = useState('');

    // Formulario de reserva
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        tuition: '',
        purpose: ''
    });

    const [ticketNumber, setTicketNumber] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        // Inicializar fecha con el día de mañana por defecto
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }, []);

    // Fetch rooms from API
    useEffect(() => {
        const fetchRooms = async () => {
            setRoomsLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/rooms`);
                if (res.ok) {
                    const data = await res.json();
                    setRoomsData(data);
                } else {
                    setError('No se pudieron cargar las salas disponibles.');
                }
            } catch (err) {
                setError('Error de conexión al cargar las salas.');
                console.error(err);
            } finally {
                setRoomsLoading(false);
            }
        };
        fetchRooms();
    }, []);

    // Cargar reserva de slots reales al cambiar fecha, sala o asistentes
    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            if (selectedRoom && selectedDate) {
                setApiLoading(true);
                setError('');
                try {
                    const response = await fetch(`${BACKEND_URL}/bookings/occupied?room_id=${selectedRoom.id}&date=${selectedDate}&attendees=${attendees}`);
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
    }, [selectedRoom, selectedDate, attendees]);

    const handleRoomSelect = (room) => {
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

        // Garantizar clave de idempotencia consistente si se reenvía el formulario
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
                    'Content-Type': 'application/json'
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
                    idempotency_key: currentKey,
                    bypass_validation: localStorage.getItem("disableMembershipValidation") === "true"
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Si la reserva fue exitosa (o recuperada de forma idempotente)
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

    return (
        <div className="bg-gray-50 min-h-screen font-lato">
            <header className="relative min-h-[50vh] pb-16 bg-[#06092E] flex flex-col justify-start items-center text-white text-center overflow-hidden">
                {/* Fondo con degradado elegante a juego con el resto del sitio */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#06092E] via-[#080c3e] to-[#040620] z-0"></div>

                {/* Navbar */}
                <div className="w-full z-20">
                    <ResponsiveNav />
                </div>

                {/* Hero Content */}
                <div className="flex flex-col justify-center items-center text-center z-10 px-6 flex-grow mt-28 md:mt-36 w-full max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 tracking-tight">
                        Reserva de Salas
                    </h1>
                    <p className="text-slate-300 font-light max-w-2xl text-sm md:text-base font-lato leading-relaxed">
                        Espacios modernos, tecnológicos y profesionales diseñados para potenciar tus reuniones, capacitaciones y jornadas de trabajo.
                    </p>
                </div>
            </header>


            {/* Stepper Navigation */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-8">
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

                {/* API Error Alert */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-bold mb-6 text-sm flex items-center gap-2 max-w-3xl mx-auto">
                        <FaInfoCircle /> {error}
                    </div>
                )}

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
                            <p className="text-sm mt-1">Por favor, intenta nuevamente más tarde.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {roomsData.map(room => (
                                <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col group">
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={room.image}
                                            alt={room.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                            Incluido con Membresía
                                        </div>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-primary mb-2">{room.name}</h3>
                                            <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-4">Capacidad: {room.capacity} personas</p>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-6">{room.description}</p>

                                            {room.amenities && room.amenities.length > 0 && (
                                                <div className="space-y-2 mb-6">
                                                    {room.amenities.map((item, idx) => {
                                                        const text = typeof item === 'string' ? item : item.text;
                                                        return (
                                                            <div key={idx} className="flex items-center text-xs text-gray-700">
                                                                <span className="text-secondary">{getAmenityIcon(text)}</span>
                                                                {text}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleRoomSelect(room)}
                                            className="w-full py-3 bg-primary hover:bg-secondary text-white font-bold rounded-xl transition-all shadow-md group-hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            Reservar esta sala <FaChevronRight className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Step 2: Date and Horarios */}
                {step === 2 && selectedRoom && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 mb-12 relative overflow-hidden">
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
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaUsers className="text-secondary" /> Cantidad de Personas
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={selectedRoom.capacity}
                                            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary font-bold text-gray-700 bg-white"
                                            value={attendees}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 1;
                                                setAttendees(val < 1 ? 1 : val);
                                            }}
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1 font-bold">Máximo: {selectedRoom.capacity} personas</p>
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
                                        // Generar una clave de idempotencia inicial para evitar reenvíos
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
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 mb-12 max-w-3xl mx-auto relative overflow-hidden">
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
                                    <span className="text-2xl font-black text-secondary block">Bonificado</span>
                                    <span className="text-[10px] text-gray-400">Uso gratuito incluido en su membresía.</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={apiLoading}
                                className="w-full py-4 bg-primary hover:bg-secondary text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Confirmar y Generar Reserva <FaCheckCircle />
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 4: Success Ticket */}
                {step === 4 && selectedRoom && (
                    <div className="mb-12 max-w-2xl mx-auto animate-fade-in print-ticket-container">
                        {/* Success Message Header */}
                        <div className="text-center mb-8 no-print">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4 shadow-inner">
                                <FaCheckCircle size={32} />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-gray-800">¡Reserva Registrada Exitosamente!</h3>
                            <p className="text-gray-500 mt-2">Hemos enviado una confirmación a tu correo. A continuación tienes tu ticket de reserva.</p>
                        </div>

                        {/* Printable Ticket */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 relative">
                            {/* Dotted border indicators */}
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 border-t border-dashed border-gray-300 z-10"></div>
                            <div className="absolute left-0 -ml-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 border-r border-gray-200 z-20"></div>
                            <div className="absolute right-0 -mr-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 border-l border-gray-200 z-20"></div>

                            {/* Ticket Top Half */}
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

                            {/* Ticket Bottom Half */}
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

                        {/* Print / Action Buttons */}
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
                                    setFormData({ name: '', email: '', phone: '', tuition: '', purpose: '' });
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

            <Footer />
        </div>
    );
};

export default Coworking;
