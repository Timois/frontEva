import { useContext } from "react"
import { LabsContext } from "../context/LabsProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const fetchLabs = () => {
  const {labs, setLabs} = useContext(LabsContext)
  const getDataLabs = async () => {
    try {
      const response = await getApi("laboratories/list")
      setLabs(response)
    }catch (error) {
      console.log(error)
    }
  }
  return {
    labs,
    getDataLabs
  }
}