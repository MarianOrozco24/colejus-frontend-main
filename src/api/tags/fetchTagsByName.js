export const fetchTagsByName = async (token, parameter) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tags/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token for authentication
            },
            body: JSON.stringify(parameter),
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
