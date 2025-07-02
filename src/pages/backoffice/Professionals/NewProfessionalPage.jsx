import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProfessional } from "../../../api/professionals/postProfessional";

const NewProfessionalPage = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "Abogado",
    tuition: "",
    email: "",
    address: "",
    phone: "",
    location: "San Rafael, Mendoza",
    procurador_professions: "", // <-- nuevo campo
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        emailError: value && !isValidEmail ? "Email inválido" : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTitleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      title: event.target.value,
      // Limpiar el campo si cambia a Abogado
      procurador_professions: prev.title === "Procurador" && event.target.value !== "Procurador"
        ? ""
        : prev.procurador_professions,
    }));
  };

  const locations = [
    "San Rafael, Mendoza",
    "Malargüe, Mendoza",
    "General Alvear, Mendoza",
    "Bowen, Mendoza",
    "Gran Mendoza",
  ];

  const handleLocationChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      location: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    // Construyo el payload
    const payload = {
      name: formData.name,
      title: formData.title,
      tuition: formData.tuition,
      email: formData.email,
      address: formData.address,
      phone: formData.phone,
      location: formData.location,
      // Backend exige siempre esta propiedad:
      procurador_professions:
        formData.title === "Procurador"
          ? [formData.procurador_professions]
          : [],
    };

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createProfessional(payload, token);

      if (response.status === 201) {
        setSuccess(true);
      } else {
        setError(response.data.message || "Error al crear el profesional.");
      }
    } catch (err) {
      console.error("Error creating professional:", err);
      setError(err.message || "Conexión no disponible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseErrorModal = () => {
    setError("");
  };

  const handleGoBack = () => {
    navigate("/backoffice/profesionales");
  };

  return (
    <div className="p-1 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl mb-6 font-bold text-primary">
        Nuevo profesional
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Título
            </label>
            <select
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Abogado">Abogado</option>
              <option value="Procurador">Procurador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Matrícula
            </label>
            <input
              type="text"
              name="tuition"
              value={formData.tuition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Campo condicional para Procurador */}
        {formData.title === "Procurador" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">
              Profesiones de Procurador
            </label>
            <input
              type="text"
              name="procurador_professions"
              value={formData.procurador_professions}
              onChange={handleInputChange}
              placeholder="Listado de profesiones"
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">
              Ubicación
            </label>
            <select
              value={formData.location}
              onChange={handleLocationChange}
              className="w-full px-4 py-3 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">
              Domicilio Legal
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">
              Teléfono
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
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
            className={`bg-primary text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3 text-center">
            <h2 className="text-xl font-bold text-primary">
              ¡Profesional creado!
            </h2>
            <button
              onClick={() => navigate("/backoffice/profesionales")}
              className="mt-6 bg-secondary text-white px-6 py-2 rounded-lg shadow hover:bg-secondary-dark transition"
            >
              Terminar
            </button>
          </div>
        </div>
      )}

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

export default NewProfessionalPage;
