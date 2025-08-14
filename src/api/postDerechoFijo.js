// api/postDerechoFijo.js
export const postDerechoFijo = async (form_data, metodo = "qr") => {
  // Mapeo de endpoint según método
  const endpoint =
    metodo === "tarjeta"
      ? "/forms/derecho_fijo_tarjeta"
      : metodo === "boleta"
      ? "/forms/boleta_bolsa"
      : "/forms/derecho_fijo_qr";

  const url = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;

  try {
    const isBoleta = metodo === "boleta";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form_data),
    });

    if (!response.ok) {
      throw new Error(`Failed operation: ${response.statusText}`);
    }

    // 🔽 Si es boleta, el backend devuelve un PDF → lo descargamos
    if (isBoleta) {
      const blob = await response.blob();
      // nombre de archivo amigable (puede venir del backend si querés)
      const filename = `boleta_${form_data?.juicio_n || "pago"}.pdf`;

      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);

      return { ok: true, downloaded: true };
    }

    // Tarjeta/QR → JSON como ya usabas
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error: Backend server is unreachable");
      throw new Error("Network error: Backend server is unreachable");
    } else {
      console.error("Error:", error);
      throw error;
    }
  }
};
