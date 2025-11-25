// export const postLiquidacionesScrapp = async (formData) => {
//   const response = await fetch(
//     `${process.env.REACT_APP_BACKEND_URL}/forms/calcular_liquidacion`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     }
//   );

//   if (!response.ok) {
//     const errorText = await response.text();  // Capturar el mensaje de error
//     console.error("Error en el servidor", response.status, errorText); // Imprimir el mensaje de error
//     throw new Error("Error generando el PDF")};

//   const blob = await response.blob();
//   const url = window.URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "liquidacion.pdf";
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
// };



// ✅ Nueva función para calcular liquidación: (informacion solamente en el frontend)
export const calcularLiquidacion = async (formData) => {
  const url = `${process.env.REACT_APP_BACKEND_URL}/forms/calcular_liquidacion`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Error al calcular la liquidación");
  }

  return data;
};



// export const postLiquidaciones = async (form_data) => {
//   try {
//     // Format the dates to dd/mm/yyyy
//     const formatDate = (date) => {
//       if (!date) return "";
//       const d = new Date(date);
//       return `${String(d.getDate()).padStart(2, "0")}/${String(
//         d.getMonth() + 1
//       ).padStart(2, "0")}/${d.getFullYear()}`;
//     };

//     const formattedData = {
//       ...form_data,
//       fecha_inicio: formatDate(form_data.fecha_inicio),
//       fecha_final: formatDate(form_data.fecha_final),
//     };

//     const response = await fetch(
//       `${process.env.REACT_APP_BACKEND_URL}/forms/liquidaciones`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formattedData),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData.error || `Failed operation: ${response.statusText}`
//       );
//     }

//     // Get filename from Content-Disposition header
//     const contentDisposition = response.headers.get("Content-Disposition");
//     let filename = "liquidacion.pdf";
//     if (contentDisposition) {
//       const filenameMatch = contentDisposition.match(
//         /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
//       );
//       if (filenameMatch && filenameMatch[1]) {
//         filename = filenameMatch[1].replace(/['"]/g, "");
//       }
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);

//     // Create temporary link
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename; // Use the filename from the header
//     document.body.appendChild(link);
//     link.click();

//     // Cleanup
//     document.body.removeChild(link);
//     setTimeout(() => window.URL.revokeObjectURL(url), 100);

//     return { success: true };
//   } catch (error) {
//     if (error instanceof TypeError && error.message === "Failed to fetch") {
//       console.error("Network error: Backend server is unreachable");
//       throw new Error("Network error: Backend server is unreachable");
//     } else {
//       console.error("Error:", error);
//       throw error;
//     }
//   }
// };
