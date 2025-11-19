import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuillEditor from "../QuillEditor"; // Import your QuillEditor component
import DatePicker, { registerLocale } from "react-datepicker"; // Date picker library
import "react-datepicker/dist/react-datepicker.css"; // Date picker CSS
import es from "date-fns/locale/es";
import { createEdict } from "../../../api/edicts/postEdict";
import { BiCopy } from "react-icons/bi";

registerLocale("es", es);

const NewEdictPage = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [edictUrl, setEdictUrl] = useState(null); // Estado para la URL del edicto
  const [copySuccess, setCopySuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: new Date(),
    scheduledDate: null, // <- nuevo campo
    content: "",
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

  const handleCopyLink = () => {
    if (edictUrl) {
      navigator.clipboard
        .writeText(edictUrl)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000); // Ocultar mensaje después de 2 segundos
        })
        .catch((err) => {
          console.error("Error copiando el link:", err);
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      date: formData.date.toISOString().split("T")[0],
      content: formData.content,
      scheduled_date: formData.scheduledDate
        ? formData.scheduledDate.toISOString().split("T")[0]
        : null,
    };

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createEdict(payload, token);

      if (response.status === 201) {
        setSuccess(true);
        setEdictUrl(response.data.public_url); // Guardar la URL pública del edicto
      } else {
        setError(response.data.message || "Error al crear el edicto.");
      }
    } catch (err) {
      console.error("Error creating news:", err);
      setError(err.message || "Conexión no disponible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccess(false);
    navigate("/backoffice/edictos"); // Redirect to backoffice after closing the modal
  };

  const handleCloseErrorModal = () => {
    setError("");
  };

  const handleGoBack = () => {
    navigate("/backoffice/edictos");
  };

  return (
    <div className="p-1 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl mb-6 font-bold text-primary">Nuevo edicto</h1>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
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

        {/* Subtitle Input */}
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

        {/* Date, Reading Duration, Tags */}
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
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  scheduledDate: date,
                }))
              }
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholderText="Ej: 01/04/2025"
              isClearable
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-500">
            Contenido
          </label>
          <QuillEditor
            value={formData.content}
            onChange={handleContentChange}
          />
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
            className={`bg-primary text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3 text-center">
            <h2 className="text-xl font-bold text-primary">
              {formData.scheduledDate &&
              new Date(formData.scheduledDate) > new Date()
                ? "¡Edicto programado!"
                : "¡Edicto publicado!"}
            </h2>

            <p className="text-gray-500 mt-4">
              {formData.scheduledDate &&
              new Date(formData.scheduledDate) > new Date()
                ? `Podrás verlo publicado el ${formData.scheduledDate.toLocaleDateString(
                    "es-AR"
                  )}.`
                : "De ahora en más vas a poder encontrarlo en la sección general de edictos."}
            </p>

            {/* Mostrar el link solo si el edicto ya está publicado */}
            {edictUrl &&
              (!formData.scheduledDate ||
                new Date(formData.scheduledDate) <= new Date()) && (
                <div className="mt-4 flex items-center justify-center bg-gray-100 border rounded-lg px-3 py-2">
                  <input
                    type="text"
                    value={edictUrl}
                    readOnly
                    className="w-full bg-transparent text-gray-600 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="ml-2 text-gray-500 hover:text-blue-500 transition"
                  >
                    <BiCopy size={20} />
                  </button>
                </div>
              )}

            {copySuccess && (
              <p className="text-green-500 mt-2">¡Copiado al portapapeles!</p>
            )}

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

export default NewEdictPage;
