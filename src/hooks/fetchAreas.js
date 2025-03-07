import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { AreaContext } from "../context/AreaProvider"

/* eslint-disable no-undef */
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