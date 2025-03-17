import axios from "axios";
import { saveToken, saveUser } from "../storage/storage"; // Importa saveToken en lugar de saveCredentials

const path = import.meta.env.VITE_AUTH_ENDPOINT; // Endpoint del backend

export const loginSystem = async (values) => {
    try {
        // Envía las credenciales al endpoint de login
        const { data } = await axios.post(path + "users/login", values, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Guarda el token JWT en el almacenamiento local
        if (data.token) {
            saveToken(data.token); // Guarda el token JWT
        }

        // Guarda la información del usuario (si está incluida en la respuesta)
        if (data.user) {
            saveUser(data.user); // Guarda la información del usuario
        }

        return data; // Devuelve la respuesta del backend
    } catch (error) {
        console.error("Error en el login:", error);
        return error.response; // Devuelve el error en caso de fallo
    }
};