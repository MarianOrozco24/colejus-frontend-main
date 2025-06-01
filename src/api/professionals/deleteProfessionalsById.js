export const deleteProfessionalsById = async (uuid, token) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/professionals/${uuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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
        console.error('delete professional Error:', error);
        return {
            data: { message: 'Conexión no disponible' },
            status: 500,
        };
    }
};
