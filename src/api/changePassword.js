export const changePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/change_password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
        }),
    });

    const data = await response.json();
    return { data, status: response.status };
};
