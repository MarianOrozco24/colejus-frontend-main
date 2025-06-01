import { useState, useEffect } from "react";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/integrantes`;

export const useIntegrantes = (token) => {
  const [integrantes, setIntegrantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    // console.log("🔐 Headers enviados:", headers);
    return headers;
  };

  const fetchIntegrantes = async () => {
    // console.log("📡 Llamando a fetchIntegrantes con token:", token);

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      // console.log("📬 Respuesta completa:", response);
      if (!response.ok) throw new Error("Error al obtener integrantes");
      const data = await response.json();
      // console.log("✅ Integrantes recibidos:", data);
      setIntegrantes(data);
    } catch (error) {
      console.error("❌ Error al obtener integrantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarIntegrante = async (nuevo) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(nuevo),
      });
      const data = await response.json();
      setIntegrantes((prev) => [data, ...prev]);
    } catch (error) {
      console.error("❌ Error al agregar integrante:", error);
    }
  };

  const eliminarIntegrante = async (uuid) => {
    try {
      await fetch(`${API_URL}/${uuid}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      setIntegrantes((prev) => prev.filter((i) => i.uuid !== uuid));
    } catch (error) {
      console.error("❌ Error al eliminar integrante:", error);
    }
  };

  useEffect(() => {
    if (token) fetchIntegrantes();
  }, [token]);

  return {
    integrantes,
    loading,
    agregarIntegrante,
    eliminarIntegrante,
    fetchIntegrantes,
  };
};
