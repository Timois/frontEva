// hooks/useQuestionEvaluations.js
import { getApi } from "../services/axiosServices/ApiService"

export const useQuestionEvaluations = () => {
  const fetchQuestionsAssigned = async (evaluationId) => {
    try {
      const response = await getApi(`question_evaluations/find/${evaluationId}`)
      return response
    } catch (error) {
      console.error("Error al obtener preguntas asignadas:", error)
      return null
    }
  }

  return { fetchQuestionsAssigned }
}
