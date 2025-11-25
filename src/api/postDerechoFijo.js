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

// api/forms.js
export const postDerechoFijoPresencial = async (form_data) => {
  const endpoint = "/forms/bcm/bar-code";
  const url = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;
  const ctrl = new AbortController();

  // Cancelación opcional a los 45s
  const id = setTimeout(() => ctrl.abort(), 45_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        // Enviás JSON y pedís PDF de vuelta
        "Content-Type": "application/json",
        "Accept": "application/pdf",
      },
      body: JSON.stringify(form_data),
      signal: ctrl.signal,
      // si necesitás cookies/JWT en misma raíz:
      // credentials: "include",
    });

    // Si vino un 4xx/5xx, intento parsear JSON o texto para el mensaje
    if (!response.ok) {
      let extra = "";
      try {
        const errJson = await response.json();
        extra = errJson?.message || errJson?.error || JSON.stringify(errJson);
      } catch {
        extra = await response.text();
      }
      throw new Error(`Failed operation (${response.status}): ${extra}`);
    }

    // Acá esperamos un PDF
    const blob = await response.blob();

    // Intentamos obtener filename del header Content-Disposition
    // Formatos típicos: attachment; filename="boleta_123.pdf"
    const dispo = response.headers.get("Content-Disposition") || "";
    let filename = "boleta.pdf";
    const match = dispo.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
    if (match && match[1]) {
      // Decodificamos por si viene URL-encoded
      try {
        filename = decodeURIComponent(match[1].replace(/"/g, "").trim());
      } catch {
        filename = match[1].replace(/"/g, "").trim();
      }
    }

    // Disparamos la descarga
    const urlObj = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlObj);

    // Devolvemos algo por si el caller quiere saber el resultado
    return { ok: true, filename };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("La operación tardó demasiado y fue cancelada");
    }

    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error: Backend server is unreachable");
      throw new Error("Network error: Backend server is unreachable");
    }
    console.error("Error:", error);
    throw error;
  } finally {
    clearTimeout(id);
  }
};

