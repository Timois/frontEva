import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { CareerContext } from "../context/CareerProvider"

export const useFetchCareer = () => {
    const { careers, setCareers } = useContext(CareerContext)
    const getData = async () => {
        if (careers.lenght < 1) {
            const response = await getApi("career/list")
            setCareers(response)
        }
        return careers
    }
    return { careers, getData}
}