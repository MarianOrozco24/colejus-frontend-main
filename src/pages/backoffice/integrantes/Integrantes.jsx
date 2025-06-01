import React, { useState } from "react";
import { useIntegrantes } from "../../../api/integrantes/integrantes";
import DeleteIntegrantes from "./DeleteIntegrantes";

const categoriasDisponibles = [
  "Integrantes",
  "Autoridades",
  "Tribunal de Etica",
];

const Integrantes = () => {
  const token = localStorage.getItem("authToken");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [integranteAEliminar, setIntegranteAEliminar] = useState(null);

  const { integrantes, loading, agregarIntegrante, eliminarIntegrante } =
    useIntegrantes(token);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    cargo: "",
    categoria: "Integrantes",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarIntegrante(formData);
    setFormData({
      nombre: "",
      telefono: "",
      cargo: "",
      categoria: "Integrantes",
    });
  };

  const renderByCategoria = (cat) => {
    return integrantes
      .filter((i) => i.categoria === cat)
      .map((i) => (
        <li
          key={i.uuid}
          className="flex justify-between items-center border-b py-2"
        >
          <span>
            <strong>{i.nombre}</strong> — {i.cargo}{" "}
            {i.telefono && `| Tel. ${i.telefono}`}
          </span>
          <button
            onClick={() => confirmarEliminacion(i)}
            className="text-red-600 hover:text-red-800"
          >
            Eliminar
          </button>
        </li>
      ));
  };

  const confirmarEliminacion = (integrante) => {
    setIntegranteAEliminar(integrante);
    setShowDeleteModal(true);
  };

  const cancelarEliminacion = () => {
    setShowDeleteModal(false);
    setIntegranteAEliminar(null);
  };

  const handleEliminar = async () => {
    if (integranteAEliminar) {
      await eliminarIntegrante(integranteAEliminar.uuid);
      cancelarEliminacion();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-primary">
        Administrar Integrantes
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="cargo"
          placeholder="Cargo"
          value={formData.cargo}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          {categoriasDisponibles.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-secondary text-white px-4 py-2 rounded col-span-2"
        >
          Agregar Integrante
        </button>
      </form>

      {loading ? (
        <p>Cargando integrantes...</p>
      ) : (
        categoriasDisponibles.map((cat) => (
          <div key={cat} className="mb-8">
            <h3 className="text-xl font-semibold mb-2 capitalize text-gray-700">
              {cat.replace("_", " ")}
            </h3>
            <ul>{renderByCategoria(cat)}</ul>
          </div>
        ))
      )}
      <DeleteIntegrantes
        isOpen={showDeleteModal}
        onClose={cancelarEliminacion}
        onDelete={handleEliminar}
        Integrante={integranteAEliminar?.nombre}
      />
    </div>
  );
};

export default Integrantes;
