import React, { useState, useEffect } from 'react';
import { FaHistory, FaArrowLeft, FaFileAlt, FaDownload, FaSyncAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LogHistory = () => {
    const [logFiles, setLogFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [logContent, setLogContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState(false);
    const navigate = useNavigate();

    const fetchLogFiles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/logs/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setLogFiles(data);
            } else {
                console.error("Error fetching log files:", data.message || "Failed to load log history");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching log files:", error);
            setLoading(false);
        }
    };

    const fetchLogContent = async (filename) => {
        try {
            setLoadingContent(true);
            setSelectedFile(filename);
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/logs/view/${filename}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const text = await response.text();
            setLogContent(text);
            setLoadingContent(false);
        } catch (error) {
            console.error("Error fetching log content:", error);
            setLoadingContent(false);
        }
    };

    useEffect(() => {
        fetchLogFiles();
    }, []);

    const downloadLog = () => {
        const element = document.createElement("a");
        const file = new Blob([logContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = selectedFile;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/backoffice/dev-panel')}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center">
                        <FaHistory className="mr-3" /> Historial de Logs
                    </h1>
                </div>
                <button
                    onClick={fetchLogFiles}
                    className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 font-semibold"
                >
                    <FaSyncAlt className={loading ? 'animate-spin' : ''} /> Actualizar
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow">
                {/* Sidebar: Lista de archivos */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                    <div className="bg-gray-100 px-4 py-3 font-bold text-gray-700 flex items-center">
                        <FaFileAlt className="mr-2" /> Archivos disponibles
                    </div>
                    <div className="overflow-y-auto flex-grow max-h-[70vh]">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500 italic">Cargando...</div>
                        ) : logFiles.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 italic">No hay logs guardados.</div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {logFiles.map((file) => (
                                    <li key={file}>
                                        <button
                                            onClick={() => fetchLogContent(file)}
                                            className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm font-mono ${selectedFile === file ? 'bg-blue-100 border-l-4 border-primary text-primary font-bold' : 'text-gray-600'}`}
                                        >
                                            {file}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Main: Visor de contenido */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                    <div className="bg-gray-100 px-4 py-3 font-bold text-gray-700 flex items-center justify-between">
                        <div className="flex items-center">
                            <FaTerminal className="mr-2" />
                            {selectedFile ? `Viendo: ${selectedFile}` : 'Seleccione un archivo'}
                        </div>
                        {selectedFile && (
                            <button
                                onClick={downloadLog}
                                className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-opacity-90 transition-all flex items-center gap-1"
                            >
                                <FaDownload /> Descargar
                            </button>
                        )}
                    </div>
                    <div className="p-4 bg-gray-900 flex-grow overflow-auto relative min-h-[500px] max-h-[70vh]">
                        {loadingContent ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-white">
                                <FaSyncAlt className="animate-spin mr-2" /> Cargando contenido...
                            </div>
                        ) : selectedFile ? (
                            <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                                {logContent || 'El archivo está vacío.'}
                            </pre>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 italic">
                                Selecciona un archivo de la lista para ver su contenido.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Necesitamos importar FaTerminal si no lo hicimos antes
const FaTerminal = ({ className }) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48C21.5 32 0 53.5 0 80zM224 416h-96c-8.8 0-16-7.2-16-16v-16c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16zm-170.7-33.4l80-64c8.4-6.7 8.4-19.3 0-26l-80-64c-8.4-7.2-21.3-1.6-21.3 9.6v115.1c0 10.9 12.9 16.5 21.3 9.3z"></path>
    </svg>
);

export default LogHistory;
