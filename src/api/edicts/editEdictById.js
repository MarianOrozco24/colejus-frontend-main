export const editEdictById = async (edictData, uuid, token) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/edicts/${uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token for authentication
            },
            body: JSON.stringify(edictData),
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
        console.error('edit edicts Error:', error);
        return {
            data: { message: 'Conexión no disponible' },
            status: 500,
        };
    }
};
