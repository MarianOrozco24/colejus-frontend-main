export const fetchNewsById = async (uuid) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/news/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
            data: data,
            status: response.status,
        };
    } catch (error) {
        console.error('Fetch News Error:', error);
        return {
            data: { message: 'Conexión no disponible' },
            status: 500,
        };
    }
};
