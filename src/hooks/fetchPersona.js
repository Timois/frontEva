import { useContext } from "react"
import { PersonaContext } from "../context/PersonaProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchPersona = () => {
    const { personas, setPersonas } = useContext(PersonaContext)

    const getData = async () => {
        const response = await getApi("users/list")
        setPersonas(response)
    }
    const refreshUsers = async () => {
        getData()
    }
    return { personas, getData, refreshUsers }
}