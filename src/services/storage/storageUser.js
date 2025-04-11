// Guarda el token JWT en el almacenamiento local
export const saveToken = (token) => {
    window.localStorage.setItem("jwt_token", token);
};

// Obtiene el token JWT del almacenamiento local
export const getToken = () => {
    return window.localStorage.getItem("jwt_token");
};

// Elimina el token JWT del almacenamiento local
export const removeToken = () => {
    window.localStorage.removeItem("jwt_token");
};

// Guarda la información del usuario en el almacenamiento local
export const saveUser = (user) => {
    if (user) { // Verifica que el valor no sea null ni undefined
        const dataString = JSON.stringify(user); // Convierte el objeto a JSON
        window.localStorage.setItem("user", dataString); // Guarda el JSON en localStorage
    }
};
// Obtiene la información del usuario del almacenamiento local
export const getUser = () => {
    const user = window.localStorage.getItem("user"); // Obtiene el valor del localStorage
    if (user && user !== "undefined") { // Verifica que el valor no sea null ni "undefined"
        return JSON.parse(user); // Parsea el JSON
    }
    return null; // Devuelve null si no hay un valor válido
};

export const removeUser = () => {
    window.localStorage.removeItem("user");
};

// Guarda todos los permisos del usuario
export const savePermissions = (permissions) => {
    if (permissions) {
        localStorage.setItem("permissions", JSON.stringify(permissions));
    }
};

export const getPermissions = () => {
    const data = localStorage.getItem("permissions");
    return data ? JSON.parse(data) : [];
};

export const removePermissions = () => {
    localStorage.removeItem("permissions");
};

// Guarda los permisos agrupados por rol
export const saveRolesPermissions = (rolesPermissions) => {
    if (rolesPermissions) {
        localStorage.setItem("roles_permissions", JSON.stringify(rolesPermissions));
    }
};

export const getRolesPermissions = () => {
    const data = localStorage.getItem("roles_permissions");
    return data ? JSON.parse(data) : {};
};

export const removeRolesPermissions = () => {
    localStorage.removeItem("roles_permissions");
};
