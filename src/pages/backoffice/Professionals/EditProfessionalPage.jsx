import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProfessionalById } from "../../../api/professionals/fetchProfessionalById";
import { editProfessionalById } from "../../../api/professionals/editProfessionalById";

const EditProfessionalPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "Abogado",
    tuition: "",
    email: "",
    address: "", // Nuevo campo: domicilio legal
    phone: "", // Nuevo campo: teléfono
    location: "San Rafael, Mendoza",
  });

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await fetchProfessionalById(uuid, token);
        if (response.status === 200) {
          const professional = response.data;
          setFormData({
            name: professional.name,
            title: professional.title,
            tuition: professional.tuition,
            email: "",
            address: professional.address || "", // Nuevo
            phone: professional.phone || "", // Nuevo
            location: professional.location,
          });
        } else {
          setError(response.data.message || "Error fetching professional.");
        }
      } catch (err) {
        console.error("Error in fetch:", err);
        setError("Conexión no disponible.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [uuid, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTitleChange = (event) => {
    setFormData({ ...formData, title: event.target.value });
  };

  const locations = [
    "San Rafael, Mendoza",
    "Malargüe, Mendoza",
    "General Alvear, Mendoza",
    "Bowen, Mendoza",
    "Gran Mendoza",
  ];

  const handleLocationChange = (event) => {
    setFormData({ ...formData, location: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      name: formData.name,
      tuition: formData.tuition,
      email: formData.email,
      address: formData.address, // Nuevo
      phone: formData.phone || "", // Nuevo
      location: formData.location,
    };

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await editProfessionalById(payload, uuid, token);
      // console.log("Payload enviado:", payload);
      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError(response.data.message || "Error al modificar el profesional.");
      }
    } catch (err) {
      console.error("Error updating professional:", err);
      setError(err.message || "Conexión no disponible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccess(false);
    navigate("/backoffice/profesionales"); // Redirigir al listado después de editar
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
        Editar profesional
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">
              Nombre
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">
              Título
            </label>
            <select
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Abogado">Abogado</option>
              <option value="Escribano">Escribano</option>
              <option value="Contador">Contador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Matrícula
            </label>
            <input
              type="number"
              name="tuition"
              value={formData.tuition}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

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
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
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
            className={`bg-primary text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3 text-center">
            <h2 className="text-xl font-bold text-primary">
              ¡Profesional modificado!
            </h2>
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

export default EditProfessionalPage;
