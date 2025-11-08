/* eslint-disable no-unused-vars */
import { useContext } from "react"
import { PeriodContext } from "../context/PeriodProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchPeriod = () => {
    const { periods, setPeriods } = useContext(PeriodContext)
    const getData = async () => {
        const response = await getApi("periods/list")
        setPeriods(response)
        return periods
    }

    const refreshPeriods = getData

    const getPeriodsByCareerId = async (careerId) => {
        const response = await getApi(`evaluations/findEvaluationsBYCareer/${careerId}`)
        setPeriods(response);
    }
    const getPeriodsByCareerAndGestion = async (careerId, gestionId) => {
        try {
          const response = await getApi(`academic_management_period/findPeriodsByCareerManagement/${careerId}/${gestionId}`);
          setPeriods(response);
        } catch (error) {
          //console.error("Error al obtener periodos:", error);
        }
      };
    return { periods, getData, refreshPeriods, getPeriodsByCareerId, getPeriodsByCareerAndGestion }
}


