export const login = async (email, password) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                data: errorData,
                status: response.status,
            };
        }

        const data = await response.json();
        console.log(data);

        return {
            data: data,
            status: response.status,
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            data: { message: 'Conexión no disponible' },
            status: 500,
        };
    }
};
