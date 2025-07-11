import React, { useState } from "react";

const AdminDerechoFijo = () => {
  const [value, setValue] = useState("");
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/forms/update_derecho_fijo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha: `${fecha}-01`,
          value: parseFloat(value),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Valor actualizado exitosamente.");
        setValue("");
      } else {
        setMessage(`❌ Error: ${data.error || "No se pudo guardar el dato."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-primary mb-8">Actualizar Derecho Fijo</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mes correspondiente</label>
            <input
              type="month"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor en pesos</label>
            <input
              type="number"
              min="0"
              step="100"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ej: 16000"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Guardar valor
            </button>
          </div>
        </form>

        {message && (
          <div className="text-sm text-center mt-4 font-semibold text-gray-700">{message}</div>
        )}
      </div>
    </div>
  );
};

export default AdminDerechoFijo;
