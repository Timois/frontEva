
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

export const loginSystem = async (url, values) => {
    const token_system = getTokenSystem()
    const key_system = getKeySystem()
    try {
        const { data } = await axios.post(path + url, values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token_system,
                    'X-System-Key': key_system
                }
            }
        )
        const {daily_token, weekly_token} = data.tokens
        saveCredentials(daily_token,weekly_token)
        return data
    } catch (error) {
        
        return (error.response)
    }
}

