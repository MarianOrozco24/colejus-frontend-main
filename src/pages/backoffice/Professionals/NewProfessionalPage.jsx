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
    email: "",                  // ahora incluido
    address: "",
    phone: "",
    location: "San Rafael, Mendoza",
    procurador_professions: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        emailError: value && !isValid ? "Email inválido" : ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      // limpiar el campo de procurador si no aplica
      procurador_professions: newTitle === "Procurador" ? prev.procurador_professions : ""
    }));
  };

  const locations = [
    "San Rafael, Mendoza",
    "Malargüe, Mendoza",
    "General Alvear, Mendoza",
    "Bowen, Mendoza",
    "Gran Mendoza",
  ];
  const handleLocationChange = e =>
    setFormData(prev => ({ ...prev, location: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem("authToken");
    const payload = {
      title: formData.title,
      name: formData.name,
      tuition: formData.tuition,
      email: formData.email,                // incluido en el payload
      address: formData.address,
      phone: formData.phone,
      location: formData.location,
      ...(formData.title === "Procurador" && {
        procurador_professions: formData.procurador_professions
      }),
    };

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

  return (
    <div className="p-1 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl mb-6 font-bold text-primary">Nuevo profesional</h1>
      <form onSubmit={handleSubmit}>
        {/* Primera fila: Nombre, Título, Matrícula */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Nombre Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Título</label>
            <select
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="Abogado">Abogado</option>
              <option value="Procurador">Procurador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Matrícula</label>
            <input
              type="text"
              name="tuition"
              value={formData.tuition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Segunda fila: Email, Ubicación, Teléfono */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            {formData.emailError && (
              <p className="text-red-500 text-sm mt-1">{formData.emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Ubicación</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleLocationChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Campo adicional para Procurador */}
        {formData.title === "Procurador" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">
              Procurador Profesiones
            </label>
            <input
              type="text"
              name="procurador_professions"
              value={formData.procurador_professions}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Especialidad del procurador"
              required
            />
          </div>
        )}

        {/* Domicilio Legal */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">Domicilio Legal</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/backoffice/profesionales")}
            className="px-6 py-3 border border-primary text-primary rounded-lg"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>

      {/* Modales de éxito/error */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold text-primary">¡Profesional creado!</h2>
            <button
              onClick={() => navigate("/backoffice/profesionales")}
              className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg"
            >
              Terminar
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold text-red-500">Error</h2>
            <p className="mt-2 text-gray-500">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
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
