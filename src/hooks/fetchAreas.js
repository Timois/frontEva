import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { AreaContext } from "../context/AreaProvider"


export const useFetchArea = () => {
    const { areas, setAreas } = useContext(AreaContext)
    const getData = async () => {
        if (areas.length < 1) {
            const response = await getApi("areas/list")
            setAreas(response)
        }
        return areas
    }

    return { areas, getData }
}

export const useFetchAreasByCareer = () => {
    const { areas, setAreas } = useContext(AreaContext)
    const getData = async (career_id) => {
        const response = await getApi(`areas/listByCareer/${career_id}`)
        setAreas(response)
        return response
    }

    return { areas, getData }
}