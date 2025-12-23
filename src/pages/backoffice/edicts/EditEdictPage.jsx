import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuillEditor from "../QuillEditor";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { fetchEdictById } from "../../../api/edicts/fetchEdictById";
import { editEdictById } from "../../../api/edicts/editEdictById";

registerLocale("es", es);

const EditEdictPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: new Date(),
    scheduledDate: null,
    content: "",
  });

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Meses base 0
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetchEdictById(uuid, token);
        if (response.status === 200) {
          const news = response.data;
          setFormData({
            title: news.title,
            subtitle: news.subtitle,
            date: parseLocalDate(news.date),
            scheduledDate: news.scheduled_date
              ? parseLocalDate(news.scheduled_date)
              : null,
            content: news.content,
          });
        } else {
          setError(response.data.message || "Error al obtener el edicto.");
        }
      } catch (err) {
        console.error("Error en fetch:", err);
        setError("Conexión no disponible.");
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

  const handleScheduledDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      scheduledDate: date,
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

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      date: formData.date.toISOString().split("T")[0],
      scheduled_date: formData.scheduledDate
        ? formData.scheduledDate.toISOString().split("T")[0]
        : null,
      content: formData.content,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await editEdictById(payload, uuid, token);

      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError(response.data.message || "Error al modificar el edicto.");
      }
    } catch (err) {
      console.error("Error editando edicto:", err);
      setError(err.message || "Conexión no disponible.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccess(false);
    navigate("/backoffice/edictos");
  };

  const handleCloseErrorModal = () => {
    setError("");
  };

  const handleGoBack = () => {
    navigate("/backoffice/edictos");
  };

  const parseToArgentinaDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  console.log(parseToArgentinaDate(formData.date));

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-1 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl mb-6 font-bold text-primary">Editar edicto</h1>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">
            Titular
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Subtitle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">
            Subtitulo
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Fecha
            </label>
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
            <label className="block text-sm font-medium text-gray-500">
              Fecha de publicación programada{" "}
              <span className="text-gray-400">(opcional)</span>
            </label>
            <DatePicker
              selected={formData.scheduledDate}
              onChange={handleScheduledDateChange}
              dateFormat="dd/MM/yyyy"
              locale="es-AR"
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholderText="Ej: 01/05/2025"
              isClearable
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-500">
            Contenido
          </label>
          <QuillEditor
            value={formData.content}
            onChange={handleContentChange}
          />
        </div>

        {/* Buttons */}
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
            className={`bg-primary text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3 text-center">
            <h2 className="text-xl font-bold text-primary">
              ¡Edicto modificado!
            </h2>
            <p className="text-gray-500 mt-4">
              Los cambios se guardaron exitosamente.
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

export default EditEdictPage;
