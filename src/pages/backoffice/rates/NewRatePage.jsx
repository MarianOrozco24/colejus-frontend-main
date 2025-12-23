import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';

registerLocale('es', es);

const NewRatePage = () => {
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        rate: '',
        start_date: new Date(),
        end_date: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // For rate field, validate it's a valid number with up to 4 decimal places
        if (name === 'rate') {
            const rateRegex = /^\d*\.?\d{0,4}$/;
            if (value === '' || rateRegex.test(value)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleDateChange = (date, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');

        const payload = {
            rate: parseFloat(formData.rate),
            start_date: formData.start_date.toISOString(),
            end_date: formData.end_date ? formData.end_date.toISOString() : null
        };

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.message || 'Error al crear la tasa.');
            }
        } catch (err) {
            console.error('Error creating rate:', err);
            setError(err.message || 'Conexión no disponible.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setSuccess(false);
        navigate('/backoffice/tasas');
    };

    const handleCloseErrorModal = () => {
        setError('');
    };

    const handleGoBack = () => {
        navigate('/backoffice/tasas');
    };

    return (
        <div className="p-1 w-full max-w-5xl mx-auto">
            <h1 className="text-2xl mb-6 font-bold text-primary">Nueva tasa</h1>
            <form onSubmit={handleSubmit}>
                {/* Rate Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500">Tasa</label>
                    <input
                        type="text"
                        name="rate"
                        value={formData.rate}
                        onChange={handleInputChange}
                        placeholder="0.0000"
                        className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Ingrese un número con hasta 4 decimales
                    </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Fecha de inicio</label>
                        <DatePicker
                            selected={formData.start_date}
                            onChange={(date) => handleDateChange(date, 'start_date')}
                            dateFormat="dd/MM/yyyy"
                            locale="es"
                            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Fecha de fin (opcional)</label>
                        <DatePicker
                            selected={formData.end_date}
                            onChange={(date) => handleDateChange(date, 'end_date')}
                            dateFormat="dd/MM/yyyy"
                            locale="es"
                            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                            isClearable
                            placeholderText="Sin fecha de fin"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="border-primary text-primary font-medium px-6 me-7 py-3 rounded-lg shadow transition"
                    >
                        Volver
                    </button>
                    <button
                        type="submit"
                        className={`bg-primary text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creando...' : 'Crear tasa'}
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {success && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3 text-center">
                        <h2 className="text-xl font-bold text-primary">Tasa creada!</h2>
                        <p className="text-gray-500 mt-4">
                            La tasa ha sido creada exitosamente.
                        </p>
                        <button
                            onClick={handleCloseSuccessModal}
                            className="mt-6 bg-secondary text-white px-6 py-2 rounded-lg shadow hover:bg-secondary-dark transition"
                        >
                            Terminar
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {error && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3 text-center">
                        <h2 className="text-xl font-bold text-red-500">Error</h2>
                        <p className="text-gray-500 mt-4">{error}</p>
                        <button
                            onClick={handleCloseErrorModal}
                            className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewRatePage;