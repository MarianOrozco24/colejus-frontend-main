import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../api/changePassword';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (formData.newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            const { data, status } = await changePassword(
                formData.currentPassword,
                formData.newPassword
            );

            if (status === 200) {
                localStorage.setItem('mustChangePassword', 'false');
                navigate('/backoffice/reservar-sala');
                return;
            }

            setError(data.error || 'No se pudo actualizar la contraseña.');
        } catch (err) {
            setError('Error de conexión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Cambio de contraseña obligatorio</h1>
            <p className="text-gray-600 mb-6">
                Por seguridad, debe elegir una contraseña personal antes de continuar usando el sistema.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                {error && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary text-white rounded-lg py-3 font-medium hover:bg-secondary-dark disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Guardar contraseña'}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
