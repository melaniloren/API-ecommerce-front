/**
 * Realiza un fetch incluyendo automáticamente el token JWT del localStorage.
 * Usarlo en cualquier endpoint protegido del backend.
 */
const fetchConAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    return response;
};

export default fetchConAuth;
