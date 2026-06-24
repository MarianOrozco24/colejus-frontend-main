import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuillEditor from '../QuillEditor';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { fetchNewsById } from '../../../api/news/fetchNewsById';
import { editNewsById } from '../../../api/news/editNewsById';
import TagInput from '../../../components/TagInput';
import { getNewsImageUrl } from '../../../utils/newsImageUrl';

registerLocale('es', es);

const EditNewsPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImagePath, setCurrentImagePath] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        date: new Date(),
        readingDuration: '',
        tags: [],
        content: '',
        isFeatured: false,
    });

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetchNewsById(uuid, token);
                if (response.status === 200) {
                    const news = response.data;
                    setFormData({
                        title: news.title,
                        subtitle: news.subtitle,
                        date: new Date(news.date),
                        readingDuration: news.reading_duration,
                        tags: news.tags || [],
                        content: news.content,
                        isFeatured: Boolean(news.is_featured),
                    });
                    setCurrentImagePath(news.image_path || null);
                    setImagePreview(getNewsImageUrl(news.image_path));
                } else {
                    setError(response.data.message || response.data.error || 'Error al cargar la noticia.');
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

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const MAX_SIZE_MB = 10;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            setError(`La imagen seleccionada supera el límite máximo permitido de ${MAX_SIZE_MB}MB.`);
            e.target.value = null; // Resetea el input
            setImageFile(null);
            setImagePreview(null);
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            subtitle: formData.subtitle,
            date: formData.date.toISOString().split('T')[0],
            reading_duration: parseInt(formData.readingDuration, 10),
            tags: formData.tags,
            content: formData.content,
            is_featured: formData.isFeatured,
        };

        setIsSubmitting(true);
        setError('');

        try {
            const response = await editNewsById(payload, uuid, token, imageFile);

            if (response.status === 200) {
                setSuccess(true);
                if (response.data.news?.image_path) {
                    setCurrentImagePath(response.data.news.image_path);
                }
                setImageFile(null);
            } else {
                setError(response.data.error || response.data.message || 'Error al guardar la noticia.');
            }
        } catch (err) {
            console.error('Error updating news:', err);
            setError(err.message || 'Conexión no disponible.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setSuccess(false);
        navigate('/backoffice/');
    };

    const handleCloseErrorModal = () => {
        setError('');
    };

    const handleGoBack = () => {
        navigate('/backoffice/');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error && !formData.title) {
        return <p className="text-red-500 p-4">{error}</p>;
    }

    return (
        <div className="p-1 w-full max-w-5xl mx-auto">
            <h1 className="text-2xl mb-6 font-bold text-primary">Editar noticia</h1>
            <form onSubmit={handleSubmit}>
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

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Fecha</label>
                        <DatePicker
                            selected={formData.date}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            locale="es"
                            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500">Duración de lectura</label>
                        <input
                            type="number"
                            name="readingDuration"
                            value={formData.readingDuration}
                            onChange={handleInputChange}
                            placeholder="Minutos"
                            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500">Etiquetas</label>
                        <TagInput
                            value={formData.tags}
                            onChange={(value) => handleInputChange({
                                target: {
                                    name: 'tags',
                                    value
                                }
                            })}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                        Imagen de portada
                    </label>
                    {currentImagePath && !imageFile && (
                        <p className="text-xs text-gray-400 mb-2">Imagen actual cargada en el servidor.</p>
                    )}
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
                    />
                    {formData.isFeatured && !imageFile && !currentImagePath && (
                        <p className="mt-2 text-sm text-amber-600">
                            Recomendamos subir una imagen para que la noticia se vea bien en
                            las destacadas.
                        </p>
                    )}
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="mt-4 max-h-56 rounded-lg border border-slate-200 object-cover"
                        />
                    )}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500">Contenido</label>
                    <QuillEditor value={formData.content} onChange={handleContentChange} />
                </div>

                <div className="mb-6 flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="isFeaturedEdit"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                        }
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isFeaturedEdit" className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Marcar como destacada</span>
                        <span className="block text-xs text-gray-400 mt-1">
                            Aparecerá fija arriba en Novedades y en el Home (máximo 8 destacadas).
                        </span>
                    </label>
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
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>

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

            {error && formData.title && (
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
