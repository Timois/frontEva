import axios from "axios";
import { getToken } from "../storage/storageUser"; // Importa getToken en lugar de getTokenSystem

const path = import.meta.env.VITE_API_ENDPOINT; // Endpoint del backend

// Función para realizar solicitudes GET
export const getApi = async (url) => {
    const token = getToken(); // Obtiene el token JWT

    try {
        const { data } = await axios.get(path + url, {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token JWT en la cabecera
            },
        });
        return data;
    } catch (error) {
        console.error("Error en la respuesta:", error);

        // Si el error es 401 (No autorizado), redirige al login
        if (error.response?.status === 401) {
            window.location.href = "/login"; // Redirige al usuario al login
        }

        throw error; // Lanza el error para que pueda ser manejado por el componente
    }
};

// Función para realizar solicitudes POST
export const postApi = async (url, values) => {
    const token = getToken(); // Obtiene el token JWT

    try {
        const { data } = await axios.post(path + url, values, {
            headers: {
                "Content-Type": "multipart/form-data", // Tipo de contenido
                Authorization: `Bearer ${token}`, // Incluye el token JWT en la cabecera
            },
        });
        return data;
    } catch (error) {
        console.error("Error en la respuesta:", error);

        // Si el error es 401 (No autorizado), redirige al login
        if (error.response?.status === 401) {
            window.location.href = "/login"; // Redirige al usuario al login
        }

        throw error; // Lanza el error para que pueda ser manejado por el componente
    }
};