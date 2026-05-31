import React, { useState, useEffect } from "react";
import { 
  FaDollarSign, 
  FaReceipt, 
  FaUsers, 
  FaSearch, 
  FaSyncAlt, 
  FaUserCheck, 
  FaUserTimes, 
  FaMoneyBillWave,
  FaCalculator
} from "react-icons/fa";

import { hasPermission } from "../../../utils/hasPermission";

const AdminDerechoFijo = () => {
  const canManage = hasPermission("manage_collection_admin");
  // State for Derecho Fijo Form
  const [valueDF, setValueDF] = useState("");
  const [fechaDF, setFechaDF] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [messageDF, setMessageDF] = useState("");
  const [submittingDF, setSubmittingDF] = useState(false);

  // State for Membership Fee Form
  const [valueMF, setValueMF] = useState("");
  const [fechaMF, setFechaMF] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [messageMF, setMessageMF] = useState("");
  const [submittingMF, setSubmittingMF] = useState(false);

  // State for Lawyers Validation Panel
  const [lawyers, setLawyers] = useState([]);
  const [loadingLawyers, setLoadingLawyers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const token = localStorage.getItem("authToken");

  const fetchLawyersData = async () => {
    try {
      setLoadingLawyers(true);
      
      // 1. Fetch all users
      const usersRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!usersRes.ok) throw new Error("No se pudo obtener la lista de usuarios.");
      
      const usersData = await usersRes.json();
      
      // 2. Filter users that have the 'lawyer' profile
      const lawyerUsers = usersData.filter(user => 
        user.profiles && user.profiles.some(p => 
          (p.name || p.profile_name || "").toLowerCase() === "lawyer"
        )
      );

      // 3. Query payment validation for each lawyer in parallel
      const statusPromises = lawyerUsers.map(async (lawyer) => {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lawyer_payments/validate?uuid_user=${lawyer.uuid}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          
          // Endpoint returns 200 or 402, both are valid json payloads
          const statusData = await res.json();
          return {
            ...lawyer,
            paymentStatus: {
              paid: statusData.paid,
              balance: statusData.balance || 0,
              totalPaid: statusData.total_paid || 0,
              totalOwed: statusData.total_owed || 0,
              message: statusData.message || ""
            }
          };
        } catch (err) {
          console.error(`Error validating lawyer ${lawyer.email}:`, err);
          return {
            ...lawyer,
            paymentStatus: {
              paid: false,
              balance: 0,
              totalPaid: 0,
              totalOwed: 0,
              error: true
            }
          };
        }
      });

      const lawyersWithStatus = await Promise.all(statusPromises);
      setLawyers(lawyersWithStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLawyers(false);
    }
  };

  useEffect(() => {
    fetchLawyersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitDF = async (e) => {
    e.preventDefault();
    setMessageDF("");
    setSubmittingDF(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/forms/update_derecho_fijo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha: `${fechaDF}-01`,
          value: parseFloat(valueDF),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessageDF("✅ Derecho Fijo actualizado con éxito.");
        setValueDF("");
      } else {
        setMessageDF(`❌ Error: ${data.error || "No se pudo actualizar."}`);
      }
    } catch (err) {
      console.error(err);
      setMessageDF("❌ Error al conectar con el servidor.");
    } finally {
      setSubmittingDF(false);
    }
  };

  const handleSubmitMF = async (e) => {
    e.preventDefault();
    setMessageMF("");
    setSubmittingMF(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/membership_fees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          effective_date: `${fechaMF}-01`,
          value: parseFloat(valueMF),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessageMF("✅ Membresía mensual actualizada con éxito.");
        setValueMF("");
        // Reload lawyers to recalculate total owed and balances
        fetchLawyersData();
      } else {
        setMessageMF(`❌ Error: ${data.error || "No se pudo guardar el valor de membresía."}`);
      }
    } catch (err) {
      console.error(err);
      setMessageMF("❌ Error al conectar con el servidor.");
    } finally {
      setSubmittingMF(false);
    }
  };

  // Filter lawyers based on search
  const filteredLawyers = lawyers.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lawyer statistics
  const totalLawyersCount = lawyers.length;
  const paidLawyersCount = lawyers.filter(l => l.paymentStatus?.paid).length;
  const unpaidLawyersCount = totalLawyersCount - paidLawyersCount;

  // Pagination
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLawyers = filteredLawyers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-lato">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <FaCalculator className="text-secondary" /> Administrador de Cobros
          </h1>
          <p className="text-gray-500 text-sm mt-1">Configura valores arancelarios y monitorea el estado de pago de los abogados.</p>
        </div>
        <button
          onClick={fetchLawyersData}
          className="p-2.5 bg-white text-primary border border-gray-200 hover:bg-gray-50 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 w-fit"
          title="Refrescar estado de pagos"
        >
          <FaSyncAlt className={loadingLawyers ? 'animate-spin' : ''} />
          <span className="text-xs font-semibold">Actualizar Estado</span>
        </button>
      </div>

      {/* Grid: Fee configurations */}
      {canManage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Derecho Fijo */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FaDollarSign className="text-secondary" /> Configurar Derecho Fijo
            </h2>
            <form onSubmit={handleSubmitDF} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mes correspondiente</label>
                <input
                  type="month"
                  value={fechaDF}
                  onChange={(e) => setFechaDF(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor en pesos ($)</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={valueDF}
                  onChange={(e) => setValueDF(e.target.value)}
                  placeholder="Ej: 16000"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm font-bold"
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submittingDF}
                  className="bg-secondary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-95 transition-all shadow-md disabled:opacity-50"
                >
                  {submittingDF ? "Guardando..." : "Guardar Derecho Fijo"}
                </button>
              </div>
            </form>
            {messageDF && (
              <div className={`text-xs mt-3 p-3 rounded-lg border font-medium ${messageDF.startsWith("✅") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {messageDF}
              </div>
            )}
          </div>

          {/* Card 2: Membership Value */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FaReceipt className="text-secondary" /> Configurar Valor de Membresía
            </h2>
            <form onSubmit={handleSubmitMF} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mes correspondiente</label>
                <input
                  type="month"
                  value={fechaMF}
                  onChange={(e) => setFechaMF(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor en pesos ($)</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={valueMF}
                  onChange={(e) => setValueMF(e.target.value)}
                  placeholder="Ej: 10000"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm font-bold"
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submittingMF}
                  className="bg-secondary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-opacity-95 transition-all shadow-md disabled:opacity-50"
                >
                  {submittingMF ? "Guardando..." : "Guardar Membresía"}
                </button>
              </div>
            </form>
            {messageMF && (
              <div className={`text-xs mt-3 p-3 rounded-lg border font-medium ${messageMF.startsWith("✅") ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {messageMF}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Cards for Payments Validation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Abogados</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{loadingLawyers ? "..." : totalLawyersCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-lg">
            <FaUserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Abogados al Día</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{loadingLawyers ? "..." : paidLawyersCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            <FaUserTimes size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Abogados Impagos</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{loadingLawyers ? "..." : unpaidLawyersCount}</h3>
          </div>
        </div>
      </div>

      {/* Lawyers Payment Status Title & Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <FaMoneyBillWave className="text-secondary" /> Estado de Pago de Abogados (Mes en Curso)
          </h2>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 w-full sm:max-w-xs shadow-sm bg-gray-50">
            <FaSearch className="text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="bg-transparent border-none outline-none text-xs text-gray-700 w-full placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* List Content */}
        {loadingLawyers ? (
          <div className="py-12 text-center text-gray-400">
            <FaSyncAlt className="animate-spin text-3xl mx-auto mb-3 text-secondary" />
            <p className="text-sm">Recuperando el estado de cobros de los abogados...</p>
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <FaUsers size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-600">No se encontraron abogados registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Abogado</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Total Abonado</th>
                  <th className="px-6 py-4 text-right">Total Requerido</th>
                  <th className="px-6 py-4 text-right">Saldo / Sobrante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                {paginatedLawyers.map((l) => {
                  const status = l.paymentStatus || { paid: false, balance: 0, totalPaid: 0, totalOwed: 0 };
                  const balanceValue = status.balance || 0;
                  
                  return (
                    <tr key={l.uuid} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{l.name}</div>
                        <div className="text-xs text-gray-400">{l.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {status.paid ? (
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold text-xs flex items-center gap-1.5 w-fit border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Al día
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full font-bold text-xs flex items-center gap-1.5 w-fit border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Impago
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-700">
                        ${status.totalPaid.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-700">
                        ${status.totalOwed.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${balanceValue >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {balanceValue >= 0 ? `+$${balanceValue.toFixed(2)}` : `-$${Math.abs(balanceValue).toFixed(2)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
                <span className="text-gray-500">
                  Página <strong className="text-gray-700">{currentPage}</strong> de <strong className="text-gray-700">{totalPages}</strong>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="px-2 py-1 rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-100 transition-all font-bold"
                  >
                    {"<"}
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2.5 py-1 rounded font-semibold transition-all ${
                        pageNum === currentPage
                          ? "bg-primary text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="px-2 py-1 rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-100 transition-all font-bold"
                  >
                    {">"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDerechoFijo;
