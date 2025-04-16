import { useContext } from "react"
import { QuestionContext } from "../context/QuestionsProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchQuestions = () => {
    const { questions, setQuestions } = useContext(QuestionContext)
    const getDataQuestions = async () => {
        if (questions.length < 1) {
            const response = await getApi("bank_questions/list")
            setQuestions(response)
        }
        return questions
    }

    return { questions, getDataQuestions }
}

export const useFetchQuestionsByArea = () => {
    const { questions, setQuestions } = useContext(QuestionContext)

    const getDataQuestions = async (area_id) => {
        try {
            const response = await getApi(`areas/listQuestions/${area_id}`)
            setQuestions(response) // Actualizamos el contexto con las preguntas del área
            return response
        } catch (error) {
            console.error("Error fetching questions by area:", error)
            return []
        }
    }
    return { questions, getDataQuestions }
}