// src/api/postDerechoFijo.js

// ✅ Mantiene tu contrato actual:
// pagoConTarjeta = false  -> /forms/derecho_fijo_qr  (QR Mercado Pago)
// pagoConTarjeta = true   -> /forms/derecho_fijo_tarjeta  (Checkout tarjeta)
export const postDerechoFijo = async (form_data, pagoConTarjeta = false) => {
  const endpoint = pagoConTarjeta
    ? "/forms/derecho_fijo_tarjeta"
    : "/forms/derecho_fijo_qr";

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form_data),
      }
    );

    if (!response.ok) {
      let extra = "";
      try {
        const errJson = await response.json();
        extra = errJson?.message || JSON.stringify(errJson);
      } catch (_) {
        const errTxt = await response.text();
        extra = errTxt;
      }
      throw new Error(`Failed operation (${response.status}): ${extra}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error: Backend server is unreachable");
      throw new Error("Network error: Backend server is unreachable");
    }
    console.error("Error:", error);
    throw error;
  }
};

// ✅ Nueva función para QR de la Bolsa (BCM):
// Llama a un endpoint nuevo que debe exponer tu backend: /forms/derecho_fijo_qr_bcm
export const postDerechoFijoBCM = async (form_data) => {
  const endpoint = "/forms/derecho_fijo_qr_bcm";

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form_data),
      }
    );

    if (!response.ok) {
      let extra = "";
      try {
        const errJson = await response.json();
        extra = errJson?.message || JSON.stringify(errJson);
      } catch (_) {
        const errTxt = await response.text();
        extra = errTxt;
      }
      throw new Error(`Failed operation (${response.status}): ${extra}`);
    }

    return await response.json();
    
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error: Backend server is unreachable");
      throw new Error("Network error: Backend server is unreachable");
    }
    console.error("Error:", error);
    throw error;
  }
};
