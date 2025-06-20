// hooks/useExamns.js
import { useContext } from "react"
import { ExamnsContext } from "../context/ExamnsProvider"
import {
  fetchAllExamns,
  fetchPeriodById,
  fetchExamnById,
  fetchExamnsByCareer
} from "../services/routes/ExamService"

export const useExamns = () => {
  const { examns, setExamns } = useContext(ExamnsContext)
  const {examn, setExamn} = useContext(ExamnsContext)
  const getDataExamns = async () => {
    try {
      const response = await fetchAllExamns()
      const examnsWithPeriod = await Promise.all(
        response.map(async (examn) => {
          const periodResponse = await fetchPeriodById(examn.academic_management_period_id)
          return {
            ...examn,
            period_name: periodResponse.period?.period,
          }
        })
      )
      
      setExamns(examnsWithPeriod)

    } catch (error) {
      console.error("Error al obtener exámenes:", error)
    }
  }
  const getExamnById = async (id) => {
    try {
      const response = await fetchExamnById(id)
      setExamn(response)
    } catch (error) {
      console.error("Error al obtener examen por ID:", error)
      return null
    }
  }
  
  
  const getExamnsByCareer = async (careerId) => {
    try {
      const response = await fetchExamnsByCareer(careerId)
      setExamns(response)
    } catch (error) {
      console.error("Error al obtener exámenes por carrera:", error)
    }
  }
  const refreshExamns = getExamnsByCareer
  
  return {
    examns,
    getDataExamns,
    refreshExamns,
    getExamnById,
    getExamnsByCareer,
    examn
  }
}
