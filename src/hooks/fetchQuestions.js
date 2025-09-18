/* eslint-disable no-unused-vars */
import { useContext } from "react"
import { QuestionContext } from "../context/QuestionsProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchQuestions = () => {
    const { questions, setQuestions } = useContext(QuestionContext)
    const getDataQuestions = async () => {
        const response = await getApi("bank_questions/list")
        setQuestions(response)
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
        } catch (error) {
            //console.error("Error fetching questions by area:", error)
            return []
        }
    }
    return { questions, getDataQuestions }
}

export const useFetchDisponibleQuestions = () => {
    const { questions, setQuestions } = useContext(QuestionContext)
    const fetchDisponibles = async (areaId) => {
        try {
            const response = await getApi(`question_evaluations/list?area_id=${areaId}`)
            setQuestions(response)
            return response
        } catch (error) {
           // console.error("Error al obtener preguntas disponibles:", error)
            return null
        }
    }
    return { questions, fetchDisponibles }
}

export const useFetchQuestionById = () => {
    const { question, setQuestion } = useContext(QuestionContext)
    const getQuestion = async (id) => {
        try {
            const response = await getApi(`bank_questions/find/${id}`)
            setQuestion(response)
            return response
        }catch (error) {
           // console.error("Error al obtener la pregunta:", error)
            return null
        }
    }

    return { question, getQuestion }
}