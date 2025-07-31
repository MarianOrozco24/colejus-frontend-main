export const postDerechoFijo = async (form_data, pagoConTarjeta = false) => {
    const endpoint = pagoConTarjeta
        ? "/forms/derecho_fijo_tarjeta"
        : "/forms/derecho_fijo_qr";

    try {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form_data),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed operation: ${response.statusText}`);
        }

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
