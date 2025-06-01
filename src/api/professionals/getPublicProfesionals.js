export const getPublicProfessionals = async ({ page = 1, perPage = 12, search = '', letter = '', locations = [] }) => {
    try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/public/professionals?page=${page}&per_page=${perPage}`;

        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }

        if (letter) {
            url += `&letter=${encodeURIComponent(letter)}`;
        }

        if (locations.length > 0) {
            url += `&locations=${encodeURIComponent(locations.join(','))}`;
        }

        const response = await fetch(url, {
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
        console.error('Fetch Professionals Error:', error);
        return {
            data: { message: 'Conexión no disponible' },
            status: 500,
        };
    }
};