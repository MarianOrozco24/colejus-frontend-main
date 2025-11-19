export const editNewsById = async (newsData, newsUuid, token) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/news/${newsUuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token for authentication
            },
            body: JSON.stringify(newsData),
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
            data: data,
            status: response.status,
        };
    } catch (error) {
        console.error('Create News Error:', error);
        return {
            data: { message: 'Conexión no disponible' },
            status: 500,
        };
    }
};
