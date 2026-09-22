export const fetchAllNews = async (
  page = 1,
  perPage = 10,
  activeOnly = false,
  {
    featuredOnly = false,
    excludeFeatured = false,
    signal,
  } = {}
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
