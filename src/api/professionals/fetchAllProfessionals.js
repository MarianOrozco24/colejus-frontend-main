export const fetchAllProfessionals = async (token, page = 1, perPage = 10, search = "") => {
    try {
        const base = `${process.env.REACT_APP_BACKEND_URL}/professionals`;
        const params = new URLSearchParams({
            page: page,
            per_page: perPage,
        });
        if (search && search.trim() !== "") {
            params.append("search", search.trim());
        }

        const url = `${base}?${params.toString()}`;
        console.log("📡 URL GENERADA:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        return {
            data,
            status: response.status,
        };
    } catch (error) {
        console.error('Fetch professionals Error:', error);
        return {
            data: { message: 'Conexión no disponible' },
            status: 500,
        };
    }
};
