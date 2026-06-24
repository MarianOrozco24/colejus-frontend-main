import React, { useState, useEffect, useCallback } from 'react';
import {
    FaSyncAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
    FaHistory,
    FaTable,
    FaUsers,
} from 'react-icons/fa';
import { hasPermission } from '../../utils/hasPermission';
import { syncMembership, fetchSyncHistory } from '../../api/membership';

const STATUS_LABELS = {
    completed: { label: 'Completado', className: 'bg-green-100 text-green-800' },
    failed: { label: 'Fallido', className: 'bg-red-100 text-red-800' },
    processing: { label: 'Procesando', className: 'bg-blue-100 text-blue-800' },
    pending: { label: 'Pendiente', className: 'bg-gray-100 text-gray-800' },
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
};

const MembershipSync = () => {
    const canManage = hasPermission('manage_membership_sync');
    const canView = hasPermission('view_membership_sync') || canManage;

    const [profiles] = useState(() => {
        const p = localStorage.getItem('profiles');
        return p ? JSON.parse(p) : [];
    });
    const isDev = profiles.some((p) => (p.name || p.profile_name || '').toLowerCase() === 'dev');

    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [lastResult, setLastResult] = useState(null);
    const [error, setError] = useState('');
    const [provisionUsers, setProvisionUsers] = useState(false);
    const [expandedImport, setExpandedImport] = useState(null);

    const loadHistory = useCallback(async () => {
        if (!canView && !isDev) return;
        setHistoryLoading(true);
        try {
            const { data, status } = await fetchSyncHistory();
            if (status === 200 && Array.isArray(data)) {
                setHistory(data);
            }
        } catch (err) {
            console.error('Error loading sync history:', err);
        } finally {
            setHistoryLoading(false);
        }
    }, [canView, isDev]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleSync = async () => {
        if (!canManage && !isDev) return;

        setLoading(true);
        setError('');
        setLastResult(null);

        try {
            const { data, status } = await syncMembership({ provisionUsers });

            if (status === 200 && data.import) {
                setLastResult(data.import);
                await loadHistory();
            } else {
                setError(data.error || 'No se pudo completar la sincronización.');
            }
        } catch (err) {
            setError('Error de conexión al sincronizar. Intente nuevamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!canView && !isDev) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
                    No tiene permisos para ver la sincronización de cuotas.
                </div>
            </div>
        );
    }

    const latestReport = lastResult?.report || {};

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 font-lato">
            <div className="mb-8">
                <h1 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
                    <FaSyncAlt className="text-secondary" />
                    Sincronización de Cuotas
                </h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                    Actualiza la base de datos desde el Google Sheet de secretaría
                    (<em>Listado Prof.</em>). Use este botón después de cargar cambios en el Excel
                    o espere la sincronización automática programada.
                </p>
            </div>

            {(canManage || isDev) && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-primary mb-4">Sincronizar ahora</h2>

                    <label className="flex items-start gap-3 mb-5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={provisionUsers}
                            onChange={(e) => setProvisionUsers(e.target.checked)}
                            className="mt-1"
                        />
                        <span className="text-sm text-gray-700">
                            <span className="font-semibold flex items-center gap-1">
                                <FaUsers className="text-secondary" />
                                Crear usuarios nuevos
                            </span>
                            Solo marcar la primera vez o cuando ingresen matrículas nuevas al listado.
                            No es necesario en cada sincronización diaria.
                        </span>
                    </label>

                    <button
                        onClick={handleSync}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Sincronizando desde Google Sheets...
                            </>
                        ) : (
                            <>
                                <FaSyncAlt />
                                Sincronizar cuotas desde Excel
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                            <FaExclamationTriangle />
                            {error}
                        </div>
                    )}
                </div>
            )}

            {lastResult && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-2 text-green-800 font-bold mb-3">
                        <FaCheckCircle />
                        Última sincronización completada
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <Stat label="Filas leídas" value={lastResult.rows_total} />
                        <Stat label="Normalizadas" value={lastResult.rows_normalized} />
                        <Stat label="Omitidas" value={lastResult.rows_skipped} />
                        <Stat label="Ambiguas" value={lastResult.rows_ambiguous} highlight={lastResult.rows_ambiguous > 0} />
                        <Stat label="Bloqueadas" value={lastResult.rows_blocked} />
                        {provisionUsers && (
                            <Stat label="Usuarios creados" value={lastResult.users_provisioned} />
                        )}
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                        Completado: {formatDate(lastResult.completed_at)}
                    </p>

                    {(latestReport.ambiguous_rows?.length > 0 || latestReport.skipped_rows?.length > 0) && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                            <p className="font-semibold text-amber-900 mb-2">
                                Filas que requieren revisión en secretaría
                            </p>
                            {latestReport.ambiguous_rows?.slice(0, 10).map((row) => (
                                <div key={`amb-${row.row_number}`} className="text-amber-800 text-xs mb-1">
                                    Fila {row.row_number} · Mat. {row.tuition || '—'} · &quot;{row.raw_quota}&quot;
                                </div>
                            ))}
                            {(latestReport.ambiguous_rows?.length || 0) > 10 && (
                                <p className="text-xs text-amber-700 mt-1">
                                    + {latestReport.ambiguous_rows.length - 10} filas ambiguas más (ver historial)
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                    <FaHistory />
                    Historial de sincronizaciones
                </h2>

                {historyLoading ? (
                    <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
                        <FaSpinner className="animate-spin" />
                        Cargando historial...
                    </div>
                ) : history.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">Aún no hay sincronizaciones registradas.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-gray-600">
                                    <th className="py-2 pr-4">Fecha</th>
                                    <th className="py-2 pr-4">Estado</th>
                                    <th className="py-2 pr-4">Normalizadas</th>
                                    <th className="py-2 pr-4">Ambiguas</th>
                                    <th className="py-2 pr-4">Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => {
                                    const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.pending;
                                    const isExpanded = expandedImport === item.uuid;
                                    const report = item.report || {};

                                    return (
                                        <React.Fragment key={item.uuid}>
                                            <tr className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="py-3 pr-4 whitespace-nowrap">
                                                    {formatDate(item.completed_at || item.created_at)}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4">{item.rows_normalized}</td>
                                                <td className="py-3 pr-4">
                                                    <span className={item.rows_ambiguous > 0 ? 'text-amber-700 font-semibold' : ''}>
                                                        {item.rows_ambiguous}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    {(report.ambiguous_rows?.length > 0 || item.error_message) && (
                                                        <button
                                                            onClick={() => setExpandedImport(isExpanded ? null : item.uuid)}
                                                            className="text-secondary hover:underline text-xs flex items-center gap-1"
                                                        >
                                                            <FaTable />
                                                            {isExpanded ? 'Ocultar' : 'Ver reporte'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={5} className="pb-4">
                                                        <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-2">
                                                            {item.error_message && (
                                                                <p className="text-red-700 font-medium">{item.error_message}</p>
                                                            )}
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-700">
                                                                <span>Leídas: {item.rows_total}</span>
                                                                <span>Omitidas: {item.rows_skipped}</span>
                                                                <span>Bloqueadas: {item.rows_blocked}</span>
                                                                <span>Usuarios: {item.users_provisioned}</span>
                                                            </div>
                                                            {report.ambiguous_rows?.map((row) => (
                                                                <div key={`${item.uuid}-amb-${row.row_number}`} className="text-amber-800">
                                                                    Fila {row.row_number} · Mat. {row.tuition} · {row.raw_quota}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const Stat = ({ label, value, highlight = false }) => (
    <div className={`rounded-xl p-3 ${highlight ? 'bg-amber-100' : 'bg-white/80'}`}>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-xl font-black ${highlight ? 'text-amber-800' : 'text-primary'}`}>{value ?? 0}</p>
    </div>
);

export default MembershipSync;
