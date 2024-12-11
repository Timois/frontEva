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
    // const { asignGestion, setAsignGestion} = useContext(CareerContext)
    // const getDataAsign = async () => {
    //     const response = await getApi("career/findAsign")
    //     if (response.length > 0){
    //         setAsignGestion(response)
    //     }
    // }
    return { careers, getDataCareer}
}