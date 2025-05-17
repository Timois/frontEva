import { useContext } from "react"
import { PersonaContext } from "../context/PersonaProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchPersona = () => {
    const { personas, setPersonas } = useContext(PersonaContext)

    const getData = async () => {
        if(personas.length < 1){
            const response = await getApi("users/list")
            setPersonas(response)
        }
        return personas
    }
    const refreshUsers = async () => {
        const response = await getApi("users/list")
        setPersonas(response)
    }
    return { personas, getData, refreshUsers}
}