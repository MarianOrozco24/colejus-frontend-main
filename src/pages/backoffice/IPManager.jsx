import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaBan, FaCheckCircle, FaSearch, FaArrowLeft, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const IPManager = () => {
    const [ips, setIps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchIps = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dev/ips');
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
        const interval = setInterval(fetchIps, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleBlockAction = async (ip, isBlocked) => {
        try {
            const endpoint = isBlocked ? 'unblock' : 'block';
            await fetch(`http://localhost:5000/api/dev/ips/${endpoint}`, {
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
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/backoffice/dev-panel')}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center">
                        <FaShieldAlt className="mr-3" /> Gestor de IPs
                    </h1>
                </div>
                <div className="relative w-64">
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
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">Cargando datos...</td>
                                </tr>
                            ) : filteredIps.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">No se encontraron registros.</td>
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
