export const validateMembership = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/membership/validate`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return { data, status: response.status };
};

export const syncMembership = async ({ provisionUsers = false, sourceUrl = null } = {}) => {
    const token = localStorage.getItem('authToken');
    const body = { provision_users: provisionUsers };
    if (sourceUrl) body.source_url = sourceUrl;

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/membership/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return { data, status: response.status };
};

export const fetchSyncHistory = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/membership/sync/history`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return { data, status: response.status };
};
