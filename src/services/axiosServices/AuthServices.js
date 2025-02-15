
import axios from "axios"
import { getKeySystem, getTokenSystem, saveCredentials, saveKeySystem, saveTokenSystem } from "../storage/storage"
import { decodeToken } from "../decodeService"

const path = import.meta.env.VITE_AUTH_ENDPOINT
const systemName = import.meta.env.VITE_NAME_SYSTEM
export const getToken = async (url) => {
    try {
        const { data } = await axios.get(path + url + systemName)
        const {token} = data
        saveTokenSystem(token)
        const { passwordAdmin } = decodeToken(token)
        saveKeySystem(passwordAdmin)
        return data
    } catch (error) {
        console.error('Error en la respuesta', error)
    }
}

import { saveUser } from "../storage/storage";

export const loginSystem = async (url, values) => {
    const token_system = getTokenSystem();
    const key_system = getKeySystem();
    try {
        const { data } = await axios.post(path + url, values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token_system,
                'X-System-Key': key_system
            }
        });

        // Guardamos los tokens
        const { daily_token, weekly_token } = data.tokens;
        saveCredentials(daily_token, weekly_token);

        // Guardamos el usuario con su rol
        if (data.user) {
            saveUser(data.user);
        }

        return data;
    } catch (error) {
        return error.response;
    }
};


