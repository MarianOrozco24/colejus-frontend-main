export const fetchNewsById = async (uuid, token, { signal } = {}) => {
  try {
    const headers = {};
    if (typeof token === "string" && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/news/${uuid}`,
      {
        method: "GET",
        headers,
        signal,
      }
    );

    let payload = {};
    try {
      payload = await response.json();
    } catch {
      payload = { message: "Respuesta inválida del servidor" };
    }

    if (!response.ok) {
      return {
        data: payload,
        status: response.status,
      };
    }

    return {
      data: payload,
      status: response.status,
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      return { data: null, status: 0, aborted: true };
    }
    console.error("Fetch News Error:", error);
    return {
      data: { message: "Conexión no disponible" },
      status: 500,
    };
  }
};
