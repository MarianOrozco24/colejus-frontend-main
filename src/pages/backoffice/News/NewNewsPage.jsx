import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuillEditor from '../QuillEditor'; // Import your QuillEditor component
import DatePicker, { registerLocale } from 'react-datepicker'; // Date picker library
import 'react-datepicker/dist/react-datepicker.css'; // Date picker CSS
import es from 'date-fns/locale/es';
import { createNews } from '../../../api/news/postNews';
import TagInput from '../../../components/TagInput';

registerLocale('es', es);

const NewNewsPage = () => {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: new Date(),
    readingDuration: '',
    tags: [],
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

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createNews(payload, token);

      if (response.status === 201) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Error al crear la noticia.');
      }
    } catch (err) {
      console.error('Error creating news:', err);
      setError(err.message || 'Conexión no disponible.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="p-1 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl mb-6 font-bold text-primary">Nueva noticia</h1>
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
          <div>
            <label className="block text-sm font-medium text-gray-500">Fecha</label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
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
              onChange={(value) => handleInputChange({ target: { name: 'tags', value } })}
            />
          </div>
        </div>

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
            className={`bg-primary text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3 text-center">
            <h2 className="text-xl font-bold text-primary">¡Noticia publicada!</h2>
            <p className="text-gray-500 mt-4">
              De ahora en más vas a poder encontrarla en la sección general de novedades.
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

export default NewNewsPage;
