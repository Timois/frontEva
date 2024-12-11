import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { UnitContext } from "../context/UnitProvider"

export const useFetchUnit = () => {
    const { units, setUnits } = useContext(UnitContext)
    const getData = async () => {
        if (units.length < 1) {
            const response = await getApi("unit/list")
            setUnits(response)
        }
        return units
    }

    return { units, getData }
}