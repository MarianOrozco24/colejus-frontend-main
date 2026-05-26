import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaBan, FaCheckCircle, FaSearch, FaArrowLeft, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const IPManager = () => {
    const [ips, setIps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [blockedRegions, setBlockedRegions] = useState([]);
    const [regionInput, setRegionInput] = useState('');
    const [regionType, setRegionType] = useState('country');
    const navigate = useNavigate();

    const fetchBlockedRegions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/regions/blocked`);
            const data = await response.json();
            setBlockedRegions(data);
        } catch (error) {
            console.error("Error fetching blocked regions:", error);
        }
    };

    const fetchIps = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/ips`);
            const data = await response.json();
            setIps(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching IPs:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIps();
        fetchBlockedRegions();
        const interval = setInterval(fetchIps, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleBlockRegion = async (e) => {
        e.preventDefault();
        if(!regionInput.trim()) return;
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/regions/block`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region_type: regionType, region_name: regionInput.trim().toUpperCase() })
            });
            setRegionInput('');
            fetchBlockedRegions();
        } catch (error) {
            console.error("Error blocking region:", error);
        }
    };

    const handleUnblockRegion = async (type, name) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/regions/unblock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region_type: type, region_name: name })
            });
            fetchBlockedRegions();
        } catch (error) {
            console.error("Error unblocking region:", error);
        }
    };

    const handleBlockAction = async (ip, isBlocked) => {
        try {
            const endpoint = isBlocked ? 'unblock' : 'block';
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/ips/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip })
            });
            fetchIps();
        } catch (error) {
            console.error(`Error ${isBlocked ? 'unblocking' : 'blocking'} IP:`, error);
        }
    };

    const filteredIps = ips.filter(item =>
        item.ip.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/backoffice/dev-panel')}
                        className="mr-3 md:mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors flex-shrink-0"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary flex items-center">
                        <FaShieldAlt className="mr-2 md:mr-3 flex-shrink-0" /> Gestor de IPs
                    </h1>
                </div>
                <div className="relative w-full md:w-64 lg:w-72">
                    <input
                        type="text"
                        placeholder="Buscar IP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Dirección IP</th>
                                <th className="px-6 py-4">Última Conexión</th>
                                <th className="px-6 py-4 flex items-center">
                                    <FaClock className="mr-1" /> Reqs/Min
                                </th>
                                <th className="px-6 py-4">
                                    <span className="flex items-center">
                                        <FaMapMarkerAlt className="mr-1" /> Ubicación
                                    </span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="flex items-center">
                                        <FaGlobe className="mr-1" /> Proveedor AS
                                    </span>
                                </th>
                                <th className="px-6 py-4">
                                    <span className="flex items-center">
                                        <FaCalendarAlt className="mr-1" /> Reqs/Mes
                                    </span>
                                </th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500 italic">Cargando datos...</td>
                                </tr>
                            ) : filteredIps.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500 italic">No se encontraron registros.</td>
                                </tr>
                            ) : (
                                filteredIps.map((item) => (
                                    <tr key={item.ip} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{item.ip}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(item.last_seen).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.requests_minute > 250 ? 'bg-red-100 text-red-600' :
                                                    item.requests_minute > 100 ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-green-100 text-green-600'
                                                }`}>
                                                {item.requests_minute}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center mb-1">
                                                    {item.pais && item.pais !== 'Desconocido' ? (
                                                        <img 
                                                            src={`https://flagcdn.com/w20/${item.pais.toLowerCase()}.png`} 
                                                            alt={item.pais} 
                                                            className="mr-2 shadow-sm rounded-sm"
                                                            title={item.pais}
                                                        />
                                                    ) : (
                                                        <FaGlobe className="mr-2 text-gray-400" />
                                                    )}
                                                    <span className="text-sm font-semibold text-gray-800">
                                                        {item.pais && item.pais !== 'Desconocido' ? item.pais : 'País Desconocido'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 ml-7">
                                                    {item.continente && item.continente !== 'Desconocido' ? `${item.continente} - ` : ''}
                                                    {item.ciudad && item.ciudad !== 'Desconocido' ? item.ciudad : 'Ciudad Desconocida'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-800 font-medium">
                                                    {item.proveedor && item.proveedor !== 'Desconocido' ? item.proveedor : 'Desconocido'}
                                                </span>
                                                <a 
                                                    href={item.dominio_proveedor && item.dominio_proveedor !== 'Desconocido' ? `https://${item.dominio_proveedor}` : '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline mt-1"
                                                >
                                                    {item.dominio_proveedor && item.dominio_proveedor !== 'Desconocido' ? item.dominio_proveedor : ''}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.requests_month}</td>
                                        <td className="px-6 py-4 text-center">
                                            {item.is_blocked ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <FaBan className="mr-1" /> Bloqueada
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FaCheckCircle className="mr-1" /> Activa
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleBlockAction(item.ip, item.is_blocked)}
                                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${item.is_blocked
                                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                                        : 'bg-red-600 text-white hover:bg-red-700'
                                                    }`}
                                            >
                                                {item.is_blocked ? 'Desbloquear' : 'Bloquear'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-md p-4 md:p-6 mb-8">
                <h3 className="text-lg md:text-xl font-bold flex items-center text-gray-800 mb-4 border-b pb-2">
                    <FaGlobe className="mr-2 text-primary" /> Bloqueo Regional (Países / Continentes)
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                        <form onSubmit={handleBlockRegion} className="flex flex-col gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Región</label>
                                <select 
                                    value={regionType} 
                                    onChange={(e) => setRegionType(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="country">País (Ej: AR, US, BR)</option>
                                    <option value="continent">Continente (Ej: SA, NA, EU)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código ISO</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: AR o SA" 
                                    value={regionInput}
                                    onChange={(e) => setRegionInput(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none uppercase"
                                />
                                <p className="text-xs text-gray-500 mt-1">Utiliza los códigos ISO de 2 letras que ves en la tabla de IPs.</p>
                            </div>
                            <button 
                                type="submit" 
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                            >
                                <FaBan className="mr-2" /> Bloquear Región
                            </button>
                        </form>
                    </div>
                    <div className="md:w-2/3">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Regiones Bloqueadas Activas:</h4>
                        {blockedRegions.length === 0 ? (
                            <div className="bg-gray-50 text-gray-500 rounded-lg p-4 text-center text-sm border border-dashed">
                                No hay ninguna región bloqueada actualmente.
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {blockedRegions.map((br) => (
                                    <div key={br.id} className="bg-red-100 border border-red-200 text-red-800 px-3 py-1.5 rounded-lg flex items-center text-sm shadow-sm">
                                        <span className="font-bold mr-2 uppercase">{br.region_type === 'country' ? 'PAÍS:' : 'CONT:'}</span>
                                        <span className="mr-3 font-mono">{br.region_name}</span>
                                        <button 
                                            onClick={() => handleUnblockRegion(br.region_type, br.region_name)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            title="Desbloquear"
                                        >
                                            <FaCheckCircle />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-lg flex items-start">
                <div className="mr-4 text-blue-500 mt-1">
                    <FaShieldAlt size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-800 uppercase mb-1">Información de Control</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        El sistema rastrea automáticamente todas las peticiones entrantes.
                        Las IPs que superen el límite de 300 peticiones por minuto son marcadas,
                        pero el bloqueo permanente debe ser realizado manualmente por un administrador
                        desde esta pantalla si se detecta un comportamiento malicioso persistente.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IPManager;
