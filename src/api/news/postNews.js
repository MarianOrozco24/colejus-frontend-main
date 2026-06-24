import { buildNewsFormData } from "../../utils/newsFormData";

export const createNews = async (newsData, token, imageFile) => {
  try {
    const formData = buildNewsFormData(newsData, imageFile);

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/news`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData = { error: "Ocurrió un error en el servidor." };
      try {
        errorData = await response.json();
      } catch (jsonError) {
        if (response.status === 413) {
          errorData = { error: "El archivo o la imagen es demasiado grande para el servidor (Límite excedido)." };
        } else {
          errorData = { error: `Error del servidor (${response.status}): ${response.statusText || 'Petición incorrecta'}` };
        }
      }
      return {
        data: errorData,
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("Create News Error:", error);
    return {
      data: { message: "Conexión no disponible" },
      status: 500,
    };
  }
};
