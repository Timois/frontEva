import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { AreaContext } from "../context/AreaProvider"


export const useFetchArea = () => {
    const { areas, setAreas } = useContext(AreaContext)
    const getDataArea = async () => {
        const response = await getApi("areas/list")
        setAreas(response)
        return areas
    }

    return { areas, getDataArea }
}
export const useFetchAreasByCareer = () => {
    const { areas, setAreas } = useContext(AreaContext)
    const getData = async (careerId) => {
        const response = await getApi(`areas/listByCareer/${careerId}`)
        setAreas(response)
    }
    return { areas, getData }
}