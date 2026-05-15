/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * Solo para uso en el frontend (mostrar/ocultar UI).
 * La validación real la hace el backend.
 */
export const decodificarToken = (token) => {
    try {
        const payload = token.split('.')[1];
        // El payload está en base64url, lo convertimos a JSON
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    } catch {
        return null;
    }
};

/**
 * Devuelve el rol del usuario logueado leyendo el token del localStorage.
 * Retorna null si no hay token o si está mal formado.
 */
export const obtenerRol = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = decodificarToken(token);
    // Spring Security guarda el rol como "role" o dentro de "authorities"/"roles"
    // Ajustá el campo según lo que devuelva tu backend
    return payload?.role || payload?.roles?.[0] || payload?.authorities?.[0] || null;
};

/**
 * Devuelve true si el usuario logueado tiene rol ADMIN.
 */
export const esAdmin = () => {
    const rol = obtenerRol();
    // Spring Security prefija los roles con "ROLE_"
    return rol === 'ROLE_ADMIN' || rol === 'ADMIN';
};
