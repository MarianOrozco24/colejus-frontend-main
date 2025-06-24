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
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    title: "Abogado",
    tuition: "",
    email: "",                   // añadido
    address: "",
    phone: "",
    location: "San Rafael, Mendoza",
    procurador_professions: ""   // añadido
  });

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await fetchProfessionalById(uuid, token);
        if (response.status === 200) {
          const p = response.data;
          setFormData({
            name: p.name,
            title: p.title,
            tuition: p.tuition,
            email: p.email || "",                         // seteado desde API
            address: p.address || "",
            phone: p.phone || "",
            location: p.location,
            procurador_professions: p.procurador_professions || "" // seteado
          });
        } else {
          setError(response.data.message || "Error fetching professional.");
        }
      } catch (err) {
        console.error(err);
        setError("Conexión no disponible.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfessional();
  }, [uuid, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      // limpiar procurador si cambio a otro título
      procurador_professions: title === "Procurador" ? prev.procurador_professions : ""
    }));
  };

  const locations = [
    "San Rafael, Mendoza",
    "Malargüe, Mendoza",
    "General Alvear, Mendoza",
    "Bowen, Mendoza",
    "Gran Mendoza",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const payload = {
      name: formData.name,
      title: formData.title,
      tuition: formData.tuition,
      email: formData.email,
      address: formData.address,
      phone: formData.phone,
      location: formData.location,
      ...(formData.title === "Procurador" && {
        procurador_professions: formData.procurador_professions
      })
    };

    try {
      const resp = await editProfessionalById(payload, uuid, token);
      if (resp.status === 200) {
        setSuccess(true);
      } else {
        setError(resp.data.message || "Error al modificar el profesional.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Conexión no disponible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error && !success) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-1 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl mb-6 font-bold text-primary">Editar profesional</h1>
      <form onSubmit={handleSubmit}>
        {/* Primera fila: Nombre, Título, Matrícula */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Nombre</label>
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
              <option value="Escribano">Escribano</option>
              <option value="Contador">Contador</option>
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

        {/* Campo condicional Procurador */}
        {formData.title === "Procurador" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Procurador Profesiones</label>
            <input
              type="text"
              name="procurador_professions"
              value={formData.procurador_professions}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        )}

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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Ubicación</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
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

        {/* Botones */}
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
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

      {/* Modales éxito/error */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold text-primary">¡Profesional modificado!</h2>
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

export default EditProfessionalPage;
