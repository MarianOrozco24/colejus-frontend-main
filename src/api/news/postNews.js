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
      const errorData = await response.json();
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
