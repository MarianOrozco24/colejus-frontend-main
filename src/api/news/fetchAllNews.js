export const fetchAllNews = async (
  page = 1,
  perPage = 10,
  activeOnly = false,
  { featuredOnly = false, excludeFeatured = false } = {}
) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });

    if (activeOnly) params.append("active_only", "true");
    if (featuredOnly) params.append("featured_only", "true");
    if (excludeFeatured) params.append("exclude_featured", "true");

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/news?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
    console.error("Fetch News Error:", error);
    return {
      data: { message: "Conexión no disponible" },
      status: 500,
    };
  }
};
