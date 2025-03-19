export const saveTokenStudent = (token) => {
    window.localStorage.setItem("jwt_token", token);
};

export const getTokenStudent = () => {
    return window.localStorage.getItem("jwt_token");
};

export const removeTokenStudent = () => {
    window.localStorage.removeItem("jwt_token");
};

export const saveStudent = (student) => {
    if (student) { // Verifica que el valor no sea null ni undefined
        const dataString = JSON.stringify(student); // Convierte el objeto a JSON
        window.localStorage.setItem("student", dataString); // Guarda el JSON en localStorage
    }
};

export const getStudent = () => {
    const student = window.localStorage.getItem("student"); // Obtiene el valor del localStorage
    if (student && student !== "undefined") { // Verifica que el valor no sea null ni "undefined"
        return JSON.parse(student); // Parsea el JSON
    }
    return null; // Devuelve null si no hay un valor válido
};

export const removeStudent = () => {
    window.localStorage.removeItem("student");
};