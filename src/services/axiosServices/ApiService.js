
import axios from "axios"
import { getTokenSystem} from "../storage/storage"


const path = import.meta.env.VITE_API_ENDPOINT
export const getApi = async (url) => {
    try {
        const { data } = await axios.get(path + url )
        return data
    } catch (error) {
        console.error('Error en la respuesta', error)
    }
}

export const postApi = async (url, values) => {
    const token_system = getTokenSystem()
    try {
        const { data } = await axios.post(path + url, values,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token_system,
                }
            }
        )
        return (data)
    } catch (error) {
        if(error.response.status == 500)
            throw error
        return (error.response)
    }
}

