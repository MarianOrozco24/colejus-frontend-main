export const fetchAllEdicts = async (
  token,
  page = 1,
  perPage = 10,
  includeScheduled = false,
  searchTerm = "",
  initialDate = "",
  finalDate = ""
) => {
  try {
    let url = `${process.env.REACT_APP_BACKEND_URL}/edicts?page=${page}&per_page=${perPage}`;

    if (includeScheduled) {
      url += "&include_scheduled=true";
    }

    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    if (initialDate) {
      url += `&initial_date=${initialDate}`;
    }

    if (finalDate) {
      url += `&final_date=${finalDate}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("Fetch edicts Error:", error);
    return {
      data: { message: "Conexión no disponible" },
      status: 500,
    };
  }
};
