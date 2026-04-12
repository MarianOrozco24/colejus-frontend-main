import React, { useState, useEffect, useRef } from 'react';
import { FaTerminal, FaMicrochip, FaMemory, FaExclamationTriangle, FaShieldAlt, FaHistory, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DevPanel = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ cpu_usage: 0, memory_usage: 0 });
    const logContainerRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dev/logs/recent');
                const data = await response.json();
                setLogs(data);
            } catch (error) {
                console.error("Error fetching recent logs:", error);
            }
        };

        fetchRecentLogs();

        let eventSource;
        if (isStreaming) {
            eventSource = new EventSource('http://localhost:5000/api/dev/logs');
            eventSource.onmessage = (event) => {
                setLogs((prevLogs) => {
                    // Evitar duplicados si el mensaje SSE ya estaba en la carga inicial (aunque poco probable en este intervalo)
                    if (prevLogs.includes(event.data)) return prevLogs;
                    return [...prevLogs.slice(-500), event.data];
                });
            };
            eventSource.onerror = (err) => {
                console.error("EventSource failed:", err);
                eventSource.close();
            };
        }

        return () => {
            if (eventSource) eventSource.close();
        };
    }, [isStreaming]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dev/stats');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, []);

    // Effect to scroll ONLY the terminal container, not the entire page
    useEffect(() => {
        if (logContainerRef.current) {
            const { scrollHeight, clientHeight } = logContainerRef.current;
            logContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    }, [logs]);

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center">
                    <FaTerminal className="mr-3" /> Panel de Desarrollador
                </h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate('/backoffice/user-manager')}
                        className="flex items-center justify-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md"
                    >
                        <FaUsers className="mr-2" /> Gestionar Usuarios
                    </button>
                    <button
                        onClick={() => navigate('/backoffice/log-history')}
                        className="flex items-center justify-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md"
                    >
                        <FaHistory className="mr-2" /> Historial de Logs
                    </button>
                    <button
                        onClick={() => navigate('/backoffice/ip-manager')}
                        className="flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md"
                    >
                        <FaShieldAlt className="mr-2" /> Gestionar IPs Bloqueadas
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* CPU Usage Card */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg md:text-xl font-semibold flex items-center">
                            <FaMicrochip className="mr-2 text-blue-500" /> Uso de CPU
                        </h2>
                        <span className="text-xl md:text-2xl font-bold text-blue-600">{stats.cpu_usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${stats.cpu_usage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Memory Usage Card */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg md:text-xl font-semibold flex items-center">
                            <FaMemory className="mr-2 text-purple-500" /> Uso de Memoria
                        </h2>
                        <span className="text-xl md:text-2xl font-bold text-purple-600">{stats.memory_usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${stats.memory_usage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Rate Limit Info */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 md:mb-8 flex items-start">
                <FaExclamationTriangle className="text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-medium text-yellow-800">Rate Limiting Activo</h3>
                    <p className="text-xs md:text-sm text-yellow-700">
                        El sistema está configurado para permitir un máximo de 300 peticiones por minuto por IP.
                        Las peticiones que excedan este límite recibirán un error 429.
                    </p>
                </div>
            </div>

            {/* Terminal Logs */}
            <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[400px] md:h-[500px]">
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                    <span className="text-gray-400 text-xs md:text-sm font-mono flex items-center">
                        <span className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2"></span>
                        <span className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2"></span>
                        app.log - Real-time streaming
                    </span>
                    <button
                        onClick={() => setIsStreaming(!isStreaming)}
                        className={`text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full font-bold transition-colors ${isStreaming ? 'bg-red-900/50 text-red-400 hover:bg-red-900' : 'bg-green-900/50 text-green-400 hover:bg-green-900'
                            }`}
                    >
                        {isStreaming ? 'PAUSE' : 'RESUME'}
                    </button>
                </div>
                <div
                    ref={logContainerRef}
                    className="flex-1 overflow-y-auto p-3 md:p-4 font-mono text-[10px] md:text-sm space-y-1"
                >
                    {logs.length === 0 ? (
                        <div className="text-gray-600 italic">Esperando logs...</div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="text-gray-300 break-all md:break-normal">
                                <span className="text-green-500 mr-2">$</span>
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DevPanel;
