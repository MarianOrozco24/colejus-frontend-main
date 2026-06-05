import React, { useState, useEffect } from 'react';
import { FaUsers, FaArrowLeft, FaUserPlus, FaUserShield, FaBan, FaCheckCircle, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newUser, setNewUser] = useState({ uuid: '', name: '', email: '', password: '', profiles: [], tuition: '' });
    const [deleteConfirmUuid, setDeleteConfirmUuid] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const headers = { 'Authorization': `Bearer ${token}` };
            const [usersRes, profilesRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/users`, { headers }),
                fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/profiles`, { headers })
            ]);
            const usersData = await usersRes.json();
            const profilesData = await profilesRes.json();
            setUsers(Array.isArray(usersData) ? usersData : []);
            setProfiles(Array.isArray(profilesData) ? profilesData : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleBlock = async (uuid) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/users/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ uuid })
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error toggling block:", error);
        }
    };

    const handleDeleteUser = async (uuid) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dev/users/${uuid}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setDeleteConfirmUuid(null);
                fetchData();
            } else {
                const data = await response.json();
                alert("Error al eliminar usuario: " + (data.error || "No se pudo completar la acción"));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error de red al eliminar usuario.");
        }
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const url = isEditing ? `${process.env.REACT_APP_BACKEND_URL}/dev/users/edit` : `${process.env.REACT_APP_BACKEND_URL}/dev/users/create`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });
            if (response.ok) {
                setShowModal(false);
                setNewUser({ uuid: '', name: '', email: '', password: '', profiles: [], tuition: '' });
                setIsEditing(false);
                fetchData();
            } else {
                const data = await response.json();
                console.error("Error saving user:", data);
                alert("Error: " + (data.error || "No se pudo guardar el usuario"));
            }
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Error de red al guardar usuario.");
        }
    };

    const handleEditUser = (user) => {
        setIsEditing(true);
        setNewUser({
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            password: '', // Leave password empty meaning do not change unless typed
            profiles: user.profiles ? user.profiles.map(p => p.uuid) : []
        });
        setShowModal(true);
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/backoffice/dev-panel')}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center">
                        <FaUsers className="mr-3" /> Administración de Usuarios
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setNewUser({ uuid: '', name: '', email: '', password: '', profiles: [], tuition: '' });
                            setShowModal(true);
                        }}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all font-semibold flex items-center gap-2 shadow-md"
                    >
                        <FaUserPlus /> Nuevo Usuario
                    </button>
                    <button
                        onClick={fetchData}
                        className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <FaSyncAlt className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center border border-gray-100">
                <FaSearch className="text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    className="w-full outline-none text-gray-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Roles</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Cargando usuarios...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No se encontraron usuarios.</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user.uuid} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.profiles && user.profiles.map(p => (
                                                <span key={p.uuid} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                                    {p.name || p.profile_name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.deleted_at ? (
                                            <span className="flex items-center text-red-600 text-xs font-bold gap-1 bg-red-50 px-2 py-1 rounded-lg w-fit">
                                                <FaBan /> BLOQUEADO
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-green-600 text-xs font-bold gap-1 bg-green-50 px-2 py-1 rounded-lg w-fit">
                                                <FaCheckCircle /> ACTIVO
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        {deleteConfirmUuid === user.uuid ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-red-600 font-bold whitespace-nowrap">¿Eliminar?</span>
                                                <button
                                                    onClick={() => handleDeleteUser(user.uuid)}
                                                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
                                                >
                                                    Sí
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmUuid(null)}
                                                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setDeleteConfirmUuid(null);
                                                        handleEditUser(user);
                                                    }}
                                                    className="text-xs font-bold px-4 py-2 rounded-lg transition-all bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteConfirmUuid(null);
                                                        toggleBlock(user.uuid);
                                                    }}
                                                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${user.deleted_at ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-yellow-600 text-white hover:bg-yellow-700'}`}
                                                >
                                                    {user.deleted_at ? 'Desbloquear' : 'Bloquear'}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmUuid(user.uuid)}
                                                    className="text-xs font-bold px-4 py-2 rounded-lg transition-all bg-red-600 text-white hover:bg-red-700"
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-primary p-6 text-white text-xl font-bold flex items-center gap-2">
                            <FaUserShield /> {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                        </div>
                        <form onSubmit={handleSubmitUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Contraseña {isEditing && <span className="text-gray-400 font-normal text-xs">(Opcional si no se cambia)</span>}
                                </label>
                                <input
                                    required={!isEditing}
                                    type="password"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            {!isEditing && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Matrícula Profesional (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: 12345"
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        value={newUser.tuition || ''}
                                        onChange={e => setNewUser({ ...newUser, tuition: e.target.value })}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Roles (Perfiles)</label>
                                <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
                                    {profiles.map(p => (
                                        <label key={p.uuid} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                            <input
                                                type="checkbox"
                                                checked={newUser.profiles.includes(p.uuid)}
                                                onChange={e => {
                                                    const updated = e.target.checked
                                                        ? [...newUser.profiles, p.uuid]
                                                        : newUser.profiles.filter(id => id !== p.uuid);
                                                    setNewUser({ ...newUser, profiles: updated });
                                                }}
                                            />
                                            <span className="text-sm">{p.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90"
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
