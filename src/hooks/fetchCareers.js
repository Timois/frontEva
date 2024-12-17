import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { CareerContext } from "../context/CareerProvider"

export const useFetchCareer = () => {
    
    const { careers, setCareers } = useContext(CareerContext)
    const getDataCareer = async () => {
        const response = await getApi("career/list")
        if (response.length > 0 ) {
            setCareers(response)
        }
        return careers
    }

    return { careers, getDataCareer}
}