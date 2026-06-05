import React, { useState, useEffect } from 'react';
import {
  FaDollarSign,
  FaSearch,
  FaPlus,
  FaUser,
  FaReceipt,
  FaSyncAlt,
  FaRegCalendarAlt,
  FaWallet,
  FaExclamationCircle
} from 'react-icons/fa';
import { hasPermission } from '../../utils/hasPermission';

const LawyerPayments = () => {
  const canManage = hasPermission("manage_lawyer_payments");
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [profiles] = useState(() => {
    const p = localStorage.getItem("profiles");
    return p ? JSON.parse(p) : [];
  });

  const isAdminOrDev = profiles.some(p =>
    ['dev', 'admin'].includes((p.name || p.profile_name || '').toLowerCase())
  );

  const getEmailFromToken = () => {
    const localEmail = localStorage.getItem("email");
    if (localEmail) return localEmail;

    const token = localStorage.getItem("authToken");
    if (!token) return "";
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).sub;
    } catch (e) {
      console.error("Error decoding token:", e);
      return "";
    }
  };

  // Modal Form State
  const [selectedUserUuid, setSelectedUserUuid] = useState('');
  const [description, setDescription] = useState('Membresía');
  const [value, setValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // New State variables for custom month and KPI validation
  const [membershipFees, setMembershipFees] = useState([]);
  const [validationStatus, setValidationStatus] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [customMonthEnabled, setCustomMonthEnabled] = useState(false);
  const [paymentMonth, setPaymentMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [selectedUserValidation, setSelectedUserValidation] = useState(null);

  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const token = localStorage.getItem("authToken");
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch payments, users, and membership fees in parallel
      // Only devs and admins are authorized to fetch `/dev/users`.
      // For lawyers, mock the users list with the current logged-in user.
      const fetchUsersPromise = isAdminOrDev
        ? fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/users`, { headers })
        : Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{
            uuid: localStorage.getItem("uuid") || '',
            email: localStorage.getItem("email") || '',
            name: localStorage.getItem("username") || '',
            profiles: [{ name: 'lawyer', profile_name: 'lawyer' }]
          }])
        });

      const [paymentsRes, usersRes, feesRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/lawyer_payments`, { headers }),
        fetchUsersPromise,
        fetch(`${process.env.REACT_APP_BACKEND_URL}/membership_fees`, { headers })
      ]);

      if (!paymentsRes.ok) throw new Error("Error al obtener el historial de pagos.");
      if (!usersRes.ok) throw new Error("Error al obtener la lista de usuarios.");
      if (!feesRes.ok) throw new Error("Error al obtener las tarifas de membresías.");

      const paymentsData = await paymentsRes.json();
      const usersData = await usersRes.json();
      const feesData = await feesRes.json();

      setPayments(paymentsData);
      setUsers(usersData);
      setMembershipFees(feesData);

      // Pre-select user if lawyer
      if (!isAdminOrDev) {
        const sessionEmail = getEmailFromToken();
        const foundUser = usersData.find(u => u.email === sessionEmail);
        const uuidFromStore = localStorage.getItem("uuid");
        setSelectedUserUuid(uuidFromStore || (foundUser ? foundUser.uuid : ''));

        // If lawyer, fetch validation details (months_owed, etc.)
        try {
          const valRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lawyer_payments/validate`, { headers });
          if (valRes.ok) {
            const valData = await valRes.json();
            setValidationStatus(valData);
          }
        } catch (valErr) {
          console.error("Error fetching validation status:", valErr);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error inesperado al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFeeForMonth = (monthStr) => {
    if (!membershipFees || !membershipFees.length) return 0;
    const targetDateStr = `${monthStr}-01`;
    const sortedFees = [...membershipFees].sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date));
    const activeFee = sortedFees.find(f => f.effective_date <= targetDateStr);
    return activeFee ? activeFee.value : 0;
  };

  useEffect(() => {
    const fetchSelectedUserValidation = async () => {
      if (!selectedUserUuid) {
        setSelectedUserValidation(null);
        return;
      }
      try {
        const token = localStorage.getItem("authToken");
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lawyer_payments/validate?uuid_user=${selectedUserUuid}`, { headers });
        if (res.ok) {
          const valData = await res.json();
          setSelectedUserValidation(valData);
        } else {
          setSelectedUserValidation(null);
        }
      } catch (err) {
        console.error("Error fetching selected user validation:", err);
        setSelectedUserValidation(null);
      }
    };

    fetchSelectedUserValidation();
  }, [selectedUserUuid]);

  // Filter users to only get lawyers
  const lawyers = users.filter(user =>
    user.profiles && user.profiles.some(p =>
      (p.name || p.profile_name || '').toLowerCase() === 'lawyer'
    )
  );

  // Filter payments based on search term
  const filteredPayments = payments.filter(p => {
    const userName = p.user?.name || '';
    const userEmail = p.user?.email || '';
    const desc = p.description || '';
    const query = searchTerm.toLowerCase();
    return userName.toLowerCase().includes(query) ||
      userEmail.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query);
  });

  // Summary stats
  const totalCollected = payments.reduce((sum, p) => sum + (p.value || 0), 0);
  const totalCount = payments.length;
  const averagePayment = totalCount > 0 ? (totalCollected / totalCount) : 0;

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    let targetUserUuid = selectedUserUuid;
    if (!isAdminOrDev) {
      const sessionEmail = getEmailFromToken();
      const foundUser = users.find(u => u.email === sessionEmail);
      targetUserUuid = localStorage.getItem("uuid") || (foundUser ? foundUser.uuid : '');
    }

    if (!targetUserUuid) {
      alert("No se pudo identificar tu usuario de sesión. Por favor inicia sesión de nuevo.");
      return;
    }

    if (!value || isNaN(value) || parseFloat(value) <= 0) {
      alert("Por favor ingresa un monto válido mayor a 0.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");

      const payload = {
        uuid_user: targetUserUuid,
        description: description,
        value: parseFloat(value)
      };

      if (customMonthEnabled && paymentMonth) {
        payload.created_at = `${paymentMonth}-01`;
      }

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lawyer_payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "No se pudo registrar el pago.");
      }

      // Success, close modal and reload
      setShowModal(false);
      if (isAdminOrDev) {
        setSelectedUserUuid('');
      }
      setDescription('Membresía');
      setValue('');
      setCustomMonthEnabled(false);
      // Reset payment month to current month
      const today = new Date();
      setPaymentMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <FaWallet className="text-secondary" /> Control de Membresías
          </h1>
          <p className="text-gray-500 text-sm mt-1">Registra y administra los pagos de membresías de los abogados colegiados.</p>
        </div>
        <div className="flex gap-3">
          {canManage && (
            <button
              onClick={() => {
                if (isAdminOrDev) {
                  setSelectedUserUuid('');
                } else {
                  const sessionEmail = getEmailFromToken();
                  const foundUser = users.find(u => u.email === sessionEmail);
                  const uuidFromStore = localStorage.getItem("uuid");
                  setSelectedUserUuid(uuidFromStore || (foundUser ? foundUser.uuid : ''));
                }
                setDescription('Membresía');
                setValue('');
                setShowModal(true);
              }}
              className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-opacity-95 transition-all font-semibold flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaPlus size={14} /> Registrar Pago
            </button>
          )}
          <button
            onClick={fetchData}
            className="p-2.5 bg-white text-primary border border-gray-200 hover:bg-gray-50 rounded-lg transition-all shadow-sm"
            title="Refrescar datos"
          >
            <FaSyncAlt className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3 text-red-700">
          <FaExclamationCircle className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className={`grid grid-cols-1 gap-6 mb-8 ${!isAdminOrDev ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {!isAdminOrDev ? (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-green-600">
                <FaDollarSign size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monto de la Membresía</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-0.5">
                  ${getFeeForMonth(selectedMonth).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Mes a consultar</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg p-1.5 outline-none focus:ring-1 focus:ring-secondary text-gray-600 bg-gray-50 font-bold"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-green-50 rounded-lg text-green-600">
              <FaDollarSign size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Recaudado</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-0.5">${totalCollected.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-blue-600">
            <FaReceipt size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-lato">Pagos Registrados</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{totalCount}</h3>
          </div>
        </div>

        {!isAdminOrDev ? (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-purple-50 rounded-lg text-purple-600">
              <FaRegCalendarAlt size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Meses Adeudados</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-0.5">
                {validationStatus ? (validationStatus.paid ? 0 : (validationStatus.months_owed || 0)) : 0}
              </h3>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-purple-50 rounded-lg text-purple-600">
              <FaRegCalendarAlt size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pago Promedio</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-0.5">${averagePayment.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
          </div>
        )}

        {!isAdminOrDev && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-lg ${validationStatus ? (
              validationStatus.balance > 0 ? "bg-green-50 text-green-600" :
                validationStatus.balance < 0 ? "bg-red-50 text-red-600" :
                  "bg-blue-50 text-blue-600"
            ) : "bg-gray-50 text-gray-600"
              }`}>
              <FaDollarSign size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {validationStatus ? (
                  validationStatus.balance > 0 ? "Saldo a Favor" :
                    validationStatus.balance < 0 ? "Monto para estar al Día" :
                      "Estado de Cuenta"
                ) : "Estado de Cuenta"}
              </p>
              <h3 className={`text-2xl font-bold mt-0.5 ${validationStatus ? (
                validationStatus.balance > 0 ? "text-green-600" :
                  validationStatus.balance < 0 ? "text-red-600" :
                    "text-gray-800"
              ) : "text-gray-800"
                }`}>
                {validationStatus ? (
                  validationStatus.balance > 0 ? `+$${validationStatus.balance.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                    validationStatus.balance < 0 ? `$${Math.abs(validationStatus.balance).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                      "Al día"
                ) : "$0.00"}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex items-center gap-3">
        <FaSearch className="text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Buscar por abogado, email o descripción..."
          className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Payments Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <FaSyncAlt className="animate-spin text-3xl mx-auto mb-4 text-secondary" />
          <p>Cargando información de pagos...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-500">
          <FaReceipt size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-gray-600">No se encontraron pagos registrados</p>
          <p className="text-sm text-gray-400 mt-1">Registra un nuevo pago para iniciar el historial.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Fecha y Hora</th>
                  <th className="px-6 py-4">Abogado</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                {paginatedPayments.map((p) => (
                  <tr key={p.uuid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{p.user?.name || 'Usuario desconocido'}</div>
                      <div className="text-xs text-gray-400">{p.user?.email || 'S/D'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium text-xs">
                        {p.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ${p.value?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {paginatedPayments.map((p) => (
              <div key={p.uuid} className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium">{formatDate(p.created_at)}</span>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium text-[10px]">
                    {p.description}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{p.user?.name || 'Usuario desconocido'}</div>
                  <div className="text-xs text-gray-400">{p.user?.email || 'S/D'}</div>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                  <span className="text-xs text-gray-400">Total pagado</span>
                  <span className="font-bold text-gray-900 text-base">${p.value?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm">
              <span className="text-gray-500">
                Página <strong className="text-gray-700">{currentPage}</strong> de <strong className="text-gray-700">{totalPages}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-100 transition-all font-bold"
                >
                  {"<"}
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${pageNum === currentPage
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
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-100 transition-all font-bold"
                >
                  {">"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Register Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="bg-primary p-6 text-white text-lg font-bold flex items-center gap-2">
              <FaReceipt /> Registrar Pago de Membresía
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <FaUser className="text-gray-400 text-xs" /> Abogado
                </label>
                {isAdminOrDev ? (
                  <select
                    required
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-white text-gray-700 text-sm shadow-sm"
                    value={selectedUserUuid}
                    onChange={(e) => setSelectedUserUuid(e.target.value)}
                  >
                    <option value="">-- Seleccionar Abogado --</option>
                    {lawyers.map(l => (
                      <option key={l.uuid} value={l.uuid}>
                        {l.name} ({l.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    readOnly
                    className="w-full p-2.5 border border-gray-200 bg-gray-50 rounded-xl outline-none text-gray-500 text-sm shadow-sm cursor-not-allowed"
                    value={getEmailFromToken()}
                  />
                )}
                {isAdminOrDev && lawyers.length === 0 && !loading && (
                  <p className="text-xs text-amber-600 mt-1">No hay usuarios con el rol de abogado ('lawyer') registrados.</p>
                )}
                {selectedUserValidation && (
                  <div className={`mt-2.5 p-3 rounded-xl border text-xs font-bold flex items-center justify-between shadow-sm transition-all ${selectedUserValidation.balance > 0 ? "bg-green-50 text-green-700 border-green-200" :
                    selectedUserValidation.balance < 0 ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                    <span>
                      {selectedUserValidation.balance > 0 ? "Saldo a Favor:" :
                        selectedUserValidation.balance < 0 ? "Monto para estar al Día:" :
                          "Estás al día."}
                    </span>
                    <span className="text-sm font-extrabold font-mono">
                      {selectedUserValidation.balance > 0 ? `+$${selectedUserValidation.balance.toFixed(2)}` :
                        selectedUserValidation.balance < 0 ? `$${Math.abs(selectedUserValidation.balance).toFixed(2)}` :
                          "$0.00"}
                    </span>
                  </div>
                )}
              </div>

              {/* Custom Month Switch */}
              <div className="flex items-center justify-between bg-gray-50 p-3.5 rounded-xl border border-gray-100 shadow-inner">
                <div>
                  <span className="text-xs font-bold text-gray-700 block">Abonar mes específico</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {customMonthEnabled ? "Mes personalizado seleccionado" : "Por defecto: mes en curso"}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customMonthEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setCustomMonthEnabled(enabled);
                      if (enabled) {
                        setValue(getFeeForMonth(paymentMonth).toString());
                      } else {
                        const today = new Date();
                        const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                        setValue(getFeeForMonth(currentMonthStr).toString());
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>

              {/* Show Month Selector if Custom Month Switch is enabled */}
              {customMonthEnabled && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Seleccionar Mes a Abonar</label>
                  <input
                    type="month"
                    required
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-white text-gray-700 text-sm shadow-sm font-bold"
                    value={paymentMonth}
                    onChange={(e) => {
                      const monthVal = e.target.value;
                      setPaymentMonth(monthVal);
                      setValue(getFeeForMonth(monthVal).toString());
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Descripción</label>
                <select
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-white text-gray-700 text-sm shadow-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                >
                  <option value="Membresía">Membresía</option>
                  {/* Future concepts can be added here */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Monto ($)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-gray-700 text-sm shadow-sm font-bold"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all text-sm disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-opacity-95 transition-all text-sm shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FaSyncAlt className="animate-spin" /> Registrando...
                    </>
                  ) : 'Registrar Pago'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerPayments;
