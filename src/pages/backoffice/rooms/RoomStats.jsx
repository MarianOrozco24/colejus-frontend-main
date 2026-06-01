import React, { useState, useEffect, useCallback } from 'react';
import {
    FaCalendarAlt, FaUsers, FaClock, FaChartBar,
    FaUser, FaEnvelope, FaSpinner,
    FaArrowLeft, FaFilter, FaInfoCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000/api').replace('localhost', '127.0.0.1');

// Helper to format date strings
const getTodayString = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
};

const getThirtyDaysAgoString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
};

// Days of the week in Spanish
const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const RoomStats = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    // Access control: only admin or dev
    const isAuthorized = (() => {
        const p = localStorage.getItem("profiles");
        const profilesList = p ? JSON.parse(p) : [];
        return profilesList.some(profile =>
            ['admin', 'administrador', 'dev'].includes((profile.name || profile.profile_name || '').toLowerCase())
        );
    })();

    useEffect(() => {
        if (!isAuthorized) {
            navigate('/backoffice');
        }
    }, [isAuthorized, navigate]);

    // States for rooms list and selected room
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [selectedRoomName, setSelectedRoomName] = useState('');
    const [roomsLoading, setRoomsLoading] = useState(true);

    // Filter states
    const [startDate, setStartDate] = useState(getThirtyDaysAgoString());
    const [endDate, setEndDate] = useState(getTodayString());

    // Analytics data states
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState('');

    // Toggle switch: 'intervals' or 'days'
    const [viewMode, setViewMode] = useState('intervals');

    // Tooltip state for heatmap interaction
    const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

    // Fetch all rooms on load to populate selector
    useEffect(() => {
        const fetchRooms = async () => {
            setRoomsLoading(true);
            try {
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const res = await fetch(`${BACKEND_URL}/rooms`, { headers });

                if (res.ok) {
                    const data = await res.json();
                    setRooms(data);

                    // Default to the first room in the list
                    if (data && data.length > 0) {
                        setSelectedRoomId(data[0].id);
                        setSelectedRoomName(data[0].name);
                    } else {
                        setError('No se encontraron salas registradas.');
                    }
                } else {
                    const errData = await res.json();
                    setError(errData.error || 'Error al obtener la lista de salas.');
                }
            } catch (err) {
                setError('Error de conexión al cargar las salas.');
                console.error(err);
            } finally {
                setRoomsLoading(false);
            }
        };

        fetchRooms();
    }, [token]);

    // Fetch statistics for the selected room and date range
    const fetchStats = useCallback(async () => {
        if (!selectedRoomId) return;
        setStatsLoading(true);
        setError('');
        try {
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const url = `${BACKEND_URL}/bookings/stats?room_id=${selectedRoomId}&start_date=${startDate}&end_date=${endDate}`;
            const res = await fetch(url, { headers });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                const errData = await res.json();
                setError(errData.error || 'Error al obtener las estadísticas.');
            }
        } catch (err) {
            setError('Error de conexión al cargar las estadísticas.');
            console.error(err);
        } finally {
            setStatsLoading(false);
        }
    }, [selectedRoomId, startDate, endDate, token]);

    // Fetch stats whenever room_id, startDate, or endDate changes
    useEffect(() => {
        fetchStats();
    }, [selectedRoomId, fetchStats]);

    // Handle room filter selection changes
    const handleRoomChange = (e) => {
        const roomId = e.target.value;
        setSelectedRoomId(roomId);
        const roomObj = rooms.find(r => r.id.toString() === roomId.toString());
        if (roomObj) {
            setSelectedRoomName(roomObj.name);
        }
    };

    // Render Heatmap Tooltip
    const showTooltip = (e, content) => {
        const rect = e.target.getBoundingClientRect();
        setTooltip({
            show: true,
            content,
            x: rect.left + window.scrollX + (rect.width / 2),
            y: rect.top + window.scrollY - 40
        });
    };

    const hideTooltip = () => {
        setTooltip(prev => ({ ...prev, show: false }));
    };

    // 1. Generate grid representation for Day Heatmap (Calendar view)
    const renderCalendarHeatmap = () => {
        if (!stats || !stats.days_heatmap || stats.days_heatmap.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <FaInfoCircle className="text-3xl mb-2" />
                    <p>No hay datos suficientes para el rango de fechas seleccionado.</p>
                </div>
            );
        }

        const daysData = stats.days_heatmap;
        const maxCount = Math.max(...daysData.map(d => d.count), 1);

        // Convert days_heatmap to a lookup map for faster access
        const countMap = {};
        daysData.forEach(d => {
            countMap[d.date] = d.count;
        });

        // Generate date array
        const dates = [];
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T00:00:00');
        let current = new Date(start);

        while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        // Align dates into weekly columns (Sunday index 0 to Saturday index 6)
        const weeks = [];
        let currentWeek = Array(7).fill(null);

        dates.forEach((date) => {
            const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

            // If it's Sunday and we already have items in the week, push it and start a new one
            if (dayOfWeek === 0 && currentWeek.some(x => x !== null)) {
                weeks.push(currentWeek);
                currentWeek = Array(7).fill(null);
            }
            currentWeek[dayOfWeek] = date;
        });

        if (currentWeek.some(x => x !== null)) {
            weeks.push(currentWeek);
        }

        // Render months labels at the top of the columns
        let lastMonth = -1;

        return (
            <div className="overflow-x-auto pb-4">
                <div className="min-w-[650px] p-4 flex flex-col">
                    {/* Month headers row */}
                    <div className="flex pl-10 mb-2 h-5 text-xs text-gray-500 font-semibold select-none">
                        {weeks.map((week, wIndex) => {
                            const validDate = week.find(d => d !== null);
                            if (validDate) {
                                const currentMonth = validDate.getMonth();
                                if (currentMonth !== lastMonth) {
                                    lastMonth = currentMonth;
                                    const monthLabel = validDate.toLocaleDateString('es-ES', { month: 'short' });
                                    // Estimate space to prevent overlapping label tags
                                    return (
                                        <div key={wIndex} style={{ width: `${Math.max(45, (weeks.length - wIndex) * 20)}px` }} className="capitalize truncate">
                                            {monthLabel}
                                        </div>
                                    );
                                }
                            }
                            return <div key={wIndex} style={{ width: '0px' }} />;
                        })}
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex gap-1.5">
                        {/* Day labels on the left */}
                        <div className="flex flex-col justify-between text-[11px] text-gray-400 font-medium select-none pr-3 w-8 leading-4 pt-1">
                            <span>Dom</span>
                            <span>Mar</span>
                            <span>Jue</span>
                            <span>Sáb</span>
                        </div>

                        {/* Weekly Columns */}
                        <div className="flex gap-1.5 flex-1">
                            {weeks.map((week, wIndex) => (
                                <div key={wIndex} className="flex flex-col gap-1.5">
                                    {week.map((date, dIndex) => {
                                        if (!date) {
                                            return <div key={dIndex} className="w-[15px] h-[15px] rounded-[3px] bg-transparent" />;
                                        }

                                        const dateStr = date.toISOString().split('T')[0];
                                        const count = countMap[dateStr] || 0;
                                        const intensity = count / maxCount;

                                        // Beautiful teal color spectrum
                                        const backgroundColor = count > 0
                                            ? `rgba(20, 184, 166, ${0.15 + intensity * 0.85})`
                                            : 'rgba(243, 244, 246, 1)';

                                        const tooltipText = `${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}: ${count} reserva${count !== 1 ? 's' : ''}`;

                                        return (
                                            <div
                                                key={dIndex}
                                                className={`w-[15px] h-[15px] rounded-[3px] transition-colors duration-150 cursor-pointer border border-gray-100/50 hover:border-teal-400`}
                                                style={{ backgroundColor }}
                                                onMouseEnter={(e) => showTooltip(e, tooltipText)}
                                                onMouseLeave={hideTooltip}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grid Legend */}
                    <div className="flex items-center justify-end gap-1.5 mt-4 pr-4 text-xs text-gray-500">
                        <span>Menos</span>
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-gray-100 border border-gray-200" />
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-teal-100/40" />
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-teal-300/60" />
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-teal-500/80" />
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-teal-600" />
                        <span>Más</span>
                    </div>
                </div>
            </div>
        );
    };

    // 2. Generate grid representation for Interval Heatmap (Weekday vs Time slots)
    const renderIntervalHeatmap = () => {
        if (!stats || !stats.intervals_heatmap || stats.intervals_heatmap.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <FaInfoCircle className="text-3xl mb-2" />
                    <p>No hay datos suficientes para generar los intervalos.</p>
                </div>
            );
        }

        const heatmapData = stats.intervals_heatmap;
        const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

        // Group data into weekday columns or slot rows.
        // Let's index them by slot for rows, and then weekday (0-6)
        // slots: "08:00", ..., "19:00"
        const timeSlots = [
            '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
        ];

        // Create a quick grid lookup structure: grid[slot][weekday]
        const grid = {};
        timeSlots.forEach(slot => {
            grid[slot] = {};
        });

        heatmapData.forEach(item => {
            if (grid[item.slot]) {
                grid[item.slot][item.weekday] = item.count;
            }
        });

        return (
            <div className="overflow-x-auto pb-4">
                <div className="min-w-[650px] p-4">
                    {/* Header: Weekdays (Lunes to Domingo) */}
                    <div className="gap-1 mb-2 text-center text-xs font-semibold text-gray-500" style={{ display: 'grid', gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
                        <div className="col-span-1 text-left pl-2 font-medium">Hora</div>
                        {DAYS_ES.slice(1).concat(DAYS_ES[0]).map((day, idx) => (
                            <div key={idx} className="col-span-1 border-b border-gray-100 pb-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid Rows per Time Slot */}
                    <div className="flex flex-col gap-1">
                        {timeSlots.map((slot) => {
                            const rowData = grid[slot] || {};

                            return (
                                <div key={slot} className="gap-1 items-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
                                    {/* Slot label */}
                                    <div className="col-span-1 text-left pl-2 text-xs font-bold text-gray-500 select-none">
                                        {slot} hs
                                    </div>

                                    {/* Weekday cells (idx maps 0->Lunes, ..., 6->Domingo) */}
                                    {[1, 2, 3, 4, 5, 6, 0].map((wDay) => {
                                        const count = rowData[wDay] || 0;
                                        const intensity = count / maxCount;

                                        // Beautiful indigo color spectrum
                                        const backgroundColor = count > 0
                                            ? `rgba(79, 70, 229, ${0.15 + intensity * 0.85})`
                                            : 'rgba(243, 244, 246, 0.7)';

                                        const tooltipText = `${DAYS_ES[wDay]} a las ${slot} hs: ${count} reserva${count !== 1 ? 's' : ''}`;

                                        return (
                                            <div
                                                key={wDay}
                                                className={`col-span-1 h-10 rounded-lg cursor-pointer transition-all duration-150 border border-gray-100 hover:scale-[1.03] hover:border-indigo-400 flex items-center justify-center text-xs font-medium ${count > 0 ? 'text-white' : 'text-gray-400'
                                                    }`}
                                                style={{ backgroundColor }}
                                                onMouseEnter={(e) => showTooltip(e, tooltipText)}
                                                onMouseLeave={hideTooltip}
                                            >
                                                {count > 0 ? count : '-'}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid Legend */}
                    <div className="flex items-center justify-end gap-1.5 mt-4 text-xs text-gray-500 pr-1">
                        <span>Menos</span>
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-gray-100 border border-gray-200" />
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-indigo-100/40" />
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-indigo-300/60" />
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-indigo-500/80" />
                        <div className="w-[12px] h-[12px] rounded-[2px] bg-indigo-600" />
                        <span>Más</span>
                    </div>
                </div>
            </div>
        );
    };

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-2 md:p-6 font-lato relative">
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/backoffice/reservar-sala')}
                        className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-all border border-gray-200 shadow-sm"
                        title="Volver a Reservas"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FaChartBar className="text-primary" /> Estadísticas de Salas
                        </h1>
                        <p className="text-sm text-gray-500">Métricas, concurrencia y análisis temporal del coworking</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 select-none">
                    {/* Room Selector */}
                    <div className="flex flex-col w-full sm:w-56">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <FaFilter className="text-[10px]" /> Sala Activa
                        </label>
                        {roomsLoading ? (
                            <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                        ) : (
                            <select
                                value={selectedRoomId}
                                onChange={handleRoomChange}
                                className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
                            >
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col w-full sm:w-36">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1">Desde</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={endDate}
                            className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
                        />
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col w-full sm:w-36">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1">Hasta</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                            max={getTodayString()}
                            className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Error alerts */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                    <FaInfoCircle />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Loading overlay for stats updates */}
            {statsLoading && !stats ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <FaSpinner className="text-4xl text-primary animate-spin mb-4" />
                    <p className="text-gray-500 font-semibold">Cargando métricas y estadísticas...</p>
                </div>
            ) : (
                <>
                    {/* KPIs Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* KPI 1: Promedio de reservas por día */}
                        <div className="bg-gradient-to-br from-indigo-500 to-primary text-white p-6 rounded-2xl shadow-md border border-indigo-400/20 relative overflow-hidden group">
                            <div className="absolute right-4 top-4 opacity-15 text-5xl transform group-hover:scale-110 transition-transform">
                                <FaClock />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider opacity-85">Reservas Promedio</h3>
                            <p className="text-4xl font-extrabold mt-2">
                                {stats ? stats.avg_bookings_per_day : '0.00'}
                            </p>
                            <p className="text-xs opacity-75 mt-2 flex items-center gap-1">
                                <FaInfoCircle /> promedio diario de reservas en este rango.
                            </p>
                        </div>

                        {/* KPI 2: Total de reservas en el período */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                            <div className="absolute right-4 top-4 text-gray-100 text-5xl transform group-hover:scale-110 transition-transform">
                                <FaCalendarAlt className="text-gray-100" />
                            </div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Reservas</h3>
                            <p className="text-4xl font-black text-gray-900 mt-2">
                                {stats ? stats.total_bookings : 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                cantidad de intervalos reservados acumulados.
                            </p>
                        </div>

                        {/* KPI 3: Capacidad máxima de la sala */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                            <div className="absolute right-4 top-4 text-gray-100 text-5xl transform group-hover:scale-110 transition-transform">
                                <FaUsers className="text-gray-100" />
                            </div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capacidad de Sala</h3>
                            <p className="text-4xl font-black text-gray-900 mt-2">
                                {stats ? stats.room_capacity : 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                límite de personas por intervalo de la sala {selectedRoomName.split(' ')[0] || ''}.
                            </p>
                        </div>
                    </div>

                    {/* Middle Section: Top users & Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Users Leaderboard */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <FaUser className="text-primary" /> Top Usuarios Reservantes
                                    </h2>
                                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase">
                                        Participación
                                    </span>
                                </div>

                                {statsLoading ? (
                                    <div className="space-y-4 py-8">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                                        ))}
                                    </div>
                                ) : stats && stats.top_users && stats.top_users.length > 0 ? (
                                    <div className="space-y-5">
                                        {stats.top_users.map((user, idx) => (
                                            <div key={idx} className="space-y-1.5 group select-none">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-gray-800 truncate max-w-[150px] group-hover:text-primary transition-all">
                                                        {user.name}
                                                    </span>
                                                    <span className="font-semibold text-gray-500 flex items-center gap-1">
                                                        {user.count} res. ({user.percentage}%)
                                                    </span>
                                                </div>

                                                {/* Progress Bar Container */}
                                                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${user.percentage}%` }}
                                                    />
                                                </div>

                                                <p className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                                                    <FaEnvelope className="text-[8px]" /> {user.email}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                        <FaUser className="text-3xl mb-2 opacity-50" />
                                        <p className="text-xs">No hay reservas registradas.</p>
                                    </div>
                                )}
                            </div>

                            {stats && stats.top_users && stats.top_users.length > 0 && (
                                <div className="border-t border-gray-100 pt-4 mt-6 text-center">
                                    <p className="text-[11px] text-gray-400">
                                        Representa la distribución porcentual de los 5 usuarios más concurrentes.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Room Statistics Heatmap Container */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 relative">
                            {/* Heatmap header & Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <FaChartBar className="text-primary" /> Concentración de Reservas
                                    </h2>
                                    <p className="text-[11px] text-gray-400">Distribución de días y horarios de alta ocupación</p>
                                </div>

                                {/* Mode Switch */}
                                <div className="flex bg-gray-100 p-1.5 rounded-xl self-start sm:self-center select-none shadow-inner border border-gray-200/50">
                                    <button
                                        onClick={() => setViewMode('intervals')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'intervals'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <FaClock className="text-xs" /> Intervalos
                                    </button>
                                    <button
                                        onClick={() => setViewMode('days')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'days'
                                            ? 'bg-white text-teal-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <FaCalendarAlt className="text-xs" /> Días
                                    </button>
                                </div>
                            </div>

                            {/* Heatmap Grid Rendering */}
                            {statsLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <FaSpinner className="text-3xl text-primary animate-spin mb-2" />
                                    <p className="text-xs text-gray-500">Recalculando densidad de reservas...</p>
                                </div>
                            ) : (
                                viewMode === 'intervals' ? renderIntervalHeatmap() : renderCalendarHeatmap()
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Absolute Hover Tooltip */}
            {tooltip.show && (
                <div
                    className="absolute z-50 bg-gray-900/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl border border-gray-700/60 pointer-events-none transform -translate-x-1/2 -translate-y-full whitespace-nowrap animate-fade-in"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.content}
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900/95" />
                </div>
            )}
        </div>
    );
};

export default RoomStats;
