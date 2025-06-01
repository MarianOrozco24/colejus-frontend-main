export const fetchAllTags = async (token, page = 1, perPage = 10) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tags?page=${page}&per_page=${perPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token for authentication
            },
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
            data: data, // Contains news and metadata
            status: response.status,
        };
    } catch (error) {
        console.error('Fetch tags Error:', error);
        return {
            data: { message: 'Conexión no disponible' },
            status: 500,
        };
    }
};
