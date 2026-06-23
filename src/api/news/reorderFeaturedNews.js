export const reorderFeaturedNews = async (newsUuid, direction, token) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/news/${newsUuid}/featured-order`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      }
    );

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("Reorder Featured Error:", error);
    return {
      data: { message: "Conexión no disponible" },
      status: 500,
    };
  }
};
