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
export const useFetchAreasActive = () => {
    const { areas, setAreas } = useContext(AreaContext)
    const getDataAreas = async (careerId) => {
        const response = await getApi(`areas/findActiveByCareer/${careerId}`)
        setAreas(response)  
    }
    return { areas, getDataAreas }
}

export const useFetchAreaById = () => {

    const { area, setArea } = useContext(AreaContext)
    const getDataAreaById = async (areaId) => {
        const response = await getApi(`areas/find/${areaId}`)
        setArea(response)
    }
    return { area, getDataAreaById }
}