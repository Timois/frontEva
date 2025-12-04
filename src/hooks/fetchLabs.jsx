/* eslint-disable no-unused-vars */
import { useContext } from "react"
import { LabsContext } from "../context/LabsProvider"
import { getApi, postApi } from "../services/axiosServices/ApiService"

export const fetchLabs = () => {
  const {labs, setLabs} = useContext(LabsContext)
  const getDataLabs = async () => {
    try {
      const response = await getApi("laboratories/list")
      setLabs(response)
    }catch (error) {
      // console.log(error)
    }
  }
  const getLabsByCareer = async (careerId) => {
    try {
      const response = await getApi(`laboratories/listByCareer/${careerId}`)
      setLabs(response)
    }catch (error) {
      // console.log(error)
    }
  }
  const getHorarioByLab = async (labIds) => {
    try {
      const response = await postApi("laboratories/horario/ids", labIds);
      return response.data || response;  
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  
  return {
    labs,
    getLabsByCareer,
    getDataLabs,
    getHorarioByLab
  }
}