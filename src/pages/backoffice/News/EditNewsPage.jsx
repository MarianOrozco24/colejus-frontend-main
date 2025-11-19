import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuillEditor from '../QuillEditor'; // Import your QuillEditor component
import DatePicker, { registerLocale } from 'react-datepicker'; // Date picker library
import 'react-datepicker/dist/react-datepicker.css'; // Date picker CSS
import es from 'date-fns/locale/es';
import { fetchNewsById } from '../../../api/news/fetchNewsById';
import { editNewsById } from '../../../api/news/editNewsById';
import TagInput from '../../../components/TagInput';

registerLocale('es', es);

const EditNewsPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetchNewsById(uuid, token);
                if (response.status === 200) {
                    const news = response.data;
                    setFormData({
                        title: news.title,
                        subtitle: news.subtitle,
                        date: new Date(news.date),
                        readingDuration: news.reading_duration,
                        tags: news.tags,
                        content: news.content,
                    });
                } else {
                    setError(response.data.message || 'Error fetching news.');
                }
            } catch (err) {
                console.error('Error in fetch:', err);
                setError('Conexión no disponible.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [uuid, token]);

    //FORM
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        date: new Date(),
        readingDuration: '',
        tags: '',
        content: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            date,
        }));
    };

    const handleContentChange = (content) => {
        setFormData((prev) => ({
            ...prev,
            content,
        }));
    };

    //ACTIONS
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');

        const payload = {
            title: formData.title,
            subtitle: formData.subtitle,
            date: formData.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            reading_duration: parseInt(formData.readingDuration, 10),
            tags: formData.tags,
            content: formData.content,
        };

        setLoading(true);
        setError(null);

        try {
            const response = await editNewsById(payload, uuid, token);

            if (response.status === 200) {
                setSuccess(true);
            } else {
                setError(response.data.message || 'Error al crear la noticia.');
            }
        } catch (err) {
            console.error('Error creating news:', err);
            setError(err.message || 'Conexión no disponible.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setSuccess(false);
        navigate('/backoffice/'); // Redirect to backoffice after closing the modal
    };

    const handleCloseErrorModal = () => {
        setError('');
    };

    const handleGoBack = () => {
        navigate('/backoffice/');
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-1 w-full max-w-5xl mx-auto">
            <h1 className="text-2xl mb-6 font-bold text-primary">Editar noticia</h1>
            <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500">Titular</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>

                {/* Subtitle Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-500">Subtitulo</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>

                {/* Date, Reading Duration, Tags */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Date Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Fecha</label>
                        <DatePicker
                            selected={formData.date}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Reading Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Duración de lectura</label>
                        <input
                            type="text"
                            name="readingDuration"
                            value={formData.readingDuration}
                            onChange={handleInputChange}
                            placeholder="Minutos"
                            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Etiquetas</label>
                        <TagInput
                            value={formData.tags} // Pass full tag objects
                            onChange={(value) => handleInputChange({
                                target: {
                                    name: 'tags',
                                    value
                                }
                            })}
                        />
                    </div>
                </div>

                {/* Content Editor */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500">Contenido</label>
                    <QuillEditor value={formData.content} onChange={handleContentChange} />
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
                        className="bg-primary text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition"
                    >
                        Guardar
                    </button>
                </div>
            </form>
            {/* Success Modal */}
            {success && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-1/3 text-center">
                        <h2 className="text-xl font-bold text-primary">¡Noticia modificada!</h2>
                        <p className="text-gray-500 mt-4">
                            Se guardaron los cambios exitosamente.
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

export default EditNewsPage;