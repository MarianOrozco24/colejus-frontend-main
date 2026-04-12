import React, { useState, useEffect } from 'react';
import { FaUserTag, FaArrowLeft, FaPlus, FaCheckCircle, FaBan, FaSyncAlt, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileManager = () => {
    const [profiles, setProfiles] = useState([]);
    const [accesses, setAccesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProfile, setCurrentProfile] = useState({ uuid: '', name: '', description: '', accesses: [] });
    
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profilesRes, accessesRes] = await Promise.all([
                fetch('http://localhost:5000/api/dev/profiles'),
                fetch('http://localhost:5000/api/dev/accesses')
            ]);
            const profilesData = await profilesRes.json();
            const accessesData = await accessesRes.json();
            setProfiles(profilesData);
            setAccesses(accessesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rules data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleBlock = async (uuid) => {
        try {
            const response = await fetch('http://localhost:5000/api/dev/profiles/block', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid })
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error toggling block:", error);
        }
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            const url = isEditing 
                ? 'http://localhost:5000/api/dev/profiles/edit' 
                : 'http://localhost:5000/api/dev/profiles/create';
                
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentProfile)
            });
            
            if (response.ok) {
                setShowModal(false);
                setCurrentProfile({ uuid: '', name: '', description: '', accesses: [] });
                setIsEditing(false);
                fetchData();
            } else {
                const data = await response.json();
                alert("Error: " + (data.error || "No se pudo guardar el rol"));
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Error de red.");
        }
    };

    const handleEditProfile = (profile) => {
        setIsEditing(true);
        setCurrentProfile({
            uuid: profile.uuid,
            name: profile.name,
            description: profile.description || '',
            accesses: profile.accesses ? profile.accesses.map(a => a.uuid) : []
        });
        setShowModal(true);
    };

    const filteredProfiles = profiles.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
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
                        <FaUserTag className="mr-3" /> Administración de Roles/Perfiles
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setCurrentProfile({ uuid: '', name: '', description: '', accesses: [] });
                            setShowModal(true);
                        }}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all font-semibold flex items-center gap-2 shadow-md"
                    >
                        <FaPlus /> Crear Rol
                    </button>
                    <button onClick={fetchData} className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors">
                        <FaSyncAlt className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center border border-gray-100">
                <FaSearch className="text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Buscar roles..."
                    className="w-full outline-none text-gray-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-semibold text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Accesos Habilitados</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Cargando roles...</td></tr>
                            ) : filteredProfiles.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No se encontraron roles</td></tr>
                            ) : filteredProfiles.map(profile => (
                                <tr key={profile.uuid} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{profile.name}</div>
                                        <div className="text-xs text-gray-500">{profile.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-sm">
                                            {profile.accesses && profile.accesses.map(a => (
                                                <span key={a.uuid} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                                                    {a.name}
                                                </span>
                                            ))}
                                            {(!profile.accesses || profile.accesses.length === 0) && (
                                                <span className="text-xs text-gray-400 italic">Ni un acceso</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {profile.deleted_at ? (
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
                                        <button
                                            onClick={() => handleEditProfile(profile)}
                                            className="text-xs font-bold px-4 py-2 rounded-lg transition-all bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => toggleBlock(profile.uuid)}
                                            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${profile.deleted_at ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
                                        >
                                            {profile.deleted_at ? 'Restaurar' : 'Eliminar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-primary p-6 text-white text-xl font-bold flex items-center gap-2">
                            <FaUserTag /> {isEditing ? 'Editar Rol/Perfil' : 'Crear Nuevo Rol'}
                        </div>
                        <form onSubmit={handleSubmitProfile} className="p-6 space-y-4 flex-grow overflow-y-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Rol</label>
                                <input
                                    required
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={currentProfile.name}
                                    placeholder="Ej: Editor, Moderador"
                                    onChange={e => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                                <input
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={currentProfile.description}
                                    onChange={e => setCurrentProfile({ ...currentProfile, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Permisos (Accesos)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-lg p-3 max-h-60 overflow-y-auto bg-gray-50">
                                    {accesses.map(acc => (
                                        <label key={acc.uuid} className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-gray-200 transition-colors">
                                            <input
                                                type="checkbox"
                                                className="mt-1"
                                                checked={currentProfile.accesses.includes(acc.uuid)}
                                                onChange={e => {
                                                    const updated = e.target.checked
                                                        ? [...currentProfile.accesses, acc.uuid]
                                                        : currentProfile.accesses.filter(id => id !== acc.uuid);
                                                    setCurrentProfile({ ...currentProfile, accesses: updated });
                                                }}
                                            />
                                            <div>
                                                <div className="text-sm font-bold text-gray-800 leading-tight">{acc.name}</div>
                                                <div className="text-[10px] text-gray-500">{acc.description}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-md"
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Crear Rol'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileManager;
