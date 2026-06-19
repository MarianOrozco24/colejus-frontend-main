export const fetchAllNews = async (page = 1, perPage = 10, activeOnly = false) => {
    try {
        const activeParam = activeOnly ? "&active_only=true" : "";
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/news?page=${page}&per_page=${perPage}${activeParam}`,
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
