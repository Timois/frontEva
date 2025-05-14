import axios from "axios";
import { savePermissions, saveRolesPermissions, saveToken, saveUser } from "../storage/storageUser"; // Importa saveToken en lugar de saveCredentials
import { saveStudent, saveTokenStudent, savePermissionsStudent } from "../storage/storageStudent";

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
        console.log("Login Student Values:", values);
        const { data } = await axios.post(path + "students/login", values, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("Login Student Response:", data);

        // Guarda el token JWT en el almacenamiento local
        if (data.token) {
            localStorage.setItem("jwt_token", data.token);
            saveTokenStudent(data.token);
        }
        if (data.user) {
            saveStudent(data.user);
        }
        if (data.permissions) {
            savePermissionsStudent(data.permissions);
        }
        return data;
    } catch (error) {
        console.error("Login Student Error:", error);
        throw error; // Propagar el error para manejarlo en el componente
    }
};