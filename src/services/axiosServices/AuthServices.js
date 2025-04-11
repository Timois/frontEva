import axios from "axios";
import { savePermissions, saveRolesPermissions, saveToken, saveUser } from "../storage/storageUser"; // Importa saveToken en lugar de saveCredentials
import { saveStudent, saveTokenStudent } from "../storage/storageStudent";

const path = import.meta.env.VITE_AUTH_ENDPOINT; // Endpoint del backend

export const loginSystem = async (values) => {
    try {
        const { data } = await axios.post(path + "users/login", values, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Guarda el token JWT
        if (data.token) {
            saveToken(data.token);
        }

        // Guarda la información del usuario
        if (data.user) {
            saveUser(data.user);
        }

        // Guarda los permisos generales
        if (data.permissions) {
            savePermissions(data.permissions);
        }

        // Guarda los permisos por rol
        if (data.roles_permissions) {
            saveRolesPermissions(data.roles_permissions);
        }

        return data;
    } catch (error) {
        console.error("Error en el login:", error);
        return error.response;
    }
};

export const loginStudent = async (values) => {
    try {
        const { data } = await axios.post(path + "students/login", values, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Guarda el token JWT en el almacenamiento local
        if (data.access_token) { // Usa access_token en lugar de token
           
            saveTokenStudent(data.access_token); // Guarda el token JWT
        } 
        // Guarda la información del estudiante (si está incluida en la respuesta)
        if (data.student) {
            saveStudent(data.student); // Guarda la información del estudiante
        } 

        return data; // Devuelve la respuesta del backend
    } catch (error) {
        console.error("Error en el login:", error);
        if (error.response) {
            return error.response.data;
        } else {
            return { message: error.message };
        }
    }
};