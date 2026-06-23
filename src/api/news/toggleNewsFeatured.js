export const toggleNewsFeatured = async (newsUuid, token) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/news/${newsUuid}/toggle-featured`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("Toggle Featured Error:", error);
    return {
      data: { message: "Conexión no disponible" },
      status: 500,
    };
  }
};
