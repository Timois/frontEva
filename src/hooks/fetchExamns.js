/* eslint-disable no-unused-vars */
import { useContext } from "react"
import { ExamnsContext } from "../context/ExamnsProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchExamns = () => {
  const { examns, setExamns } = useContext(ExamnsContext)

  const getDataExamns = async () => {
    try {
      const response = await getApi("evaluations/list")
      const examnsWithPeriod = await Promise.all(response.map(async (examn) => {
        const periodResponse = await getApi(`evaluations/findPeriod/${examn.academic_management_period_id}`)
        return {
          ...examn,
          period_name: periodResponse.period?.period
        }
      }))
      setExamns(examnsWithPeriod)
    } catch (error) {
      console.error("Error fetching examns:", error)
    }
  }
  const refreshExamns = async () => {
    try {
      const response = await getApi("evaluations/list")
      const examnsWithPeriod = await Promise.all(response.map(async (examn) => {
        const periodResponse = await getApi(`evaluations/findPeriod/${examn.academic_management_period_id}`)
        return {
          ...examn,
          period_name: periodResponse.period?.period
        }
      }))
      setExamns(examnsWithPeriod)
    } catch (error) {
      console.error("Error al actualizar exámenes:", error)
    }
  }
  const fetchDisponibles = async (areaId) => {
    try {
      const response = await getApi(`question_evaluations/list?area_id=${areaId}`)
      setExamns(response)
      return response
    } catch (error) {
      console.error("Error al obtener preguntas disponibles:", error)
      return null
    }
  }
  const fetchQuestionsAssigned = async (examnId) => {
    try {
      const response = await getApi(`question_evaluations/find/${examnId}`)
      setExamns(response)
      return response
    } catch (error) {
      console.error("Error al obtener preguntas asignadas:", error)
      return null
    }
  }
  const fetchStudenttestStudent = (student_test_id) => {
    try {
      const response = getApi(`student_tests/listQuestionsByStudent/${student_test_id}`)
      setExamns(response)
      return response
    } catch (error) {
      console.error("Error al obtener preguntas asignadas:", error)
      return null
    }
  }
  const fetchExamsByCareer = async (careerId) => {
    try {
      const response = await getApi(`evaluations/findEvaluationsBYCareer/${careerId}`)
      setExamns(response)
      const examnsWithPeriod = await Promise.all(response.map(async (examn) => {
        const periodResponse = await getApi(`evaluations/findPeriod/${examn.academic_management_period_id}`)
        return {
          ...examn,
          period_name: periodResponse.period?.period
        }
      }))
      setExamns(examnsWithPeriod)
      return response
    } catch (error) {
      console.error("Error al obtener exámenes por carrera:", error)
      return null
    }
  }
  return { examns, getDataExamns, refreshExamns, fetchDisponibles, fetchQuestionsAssigned, fetchStudenttestStudent, fetchExamsByCareer  }
}
