// hooks/useStudentTest.js
import { getApi } from "../services/axiosServices/ApiService"

export const useStudentTest = () => {
  const fetchQuestionsByStudentTest = async (studentTestId) => {
    try {
      const response = await getApi(`student_tests/listQuestionsByStudent/${studentTestId}`)
      return response
    } catch (error) {
      console.error("Error al obtener preguntas del estudiante:", error)
      return null
    }
  }

  return { fetchQuestionsByStudentTest }
}
