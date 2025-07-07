/* eslint-disable no-undef */
import { useContext } from "react"
import { ResultsContext } from "../context/ResultsProvider"
import { getApi, postApi } from "../services/axiosServices/ApiService"

export const fetchResultsByExam = () => {
    const {results, setResults} = useContext(ResultsContext)

    const getResults = async (examId) => {
        try {
            const response = await getApi(`student_tests/listResultsByEvaluation/${examId}`)
            setResults(response)
        } catch (error) {
            console.error("Error al obtener preguntas del estudiante:", error)
            return null
        }
    }

    const getFinalResults = async (examId) => {
        try {
            const response = await postApi(`results/finalResults/${examId}`)
            setResults(response)
        } catch (error) {
            console.error("Error al obtener preguntas del estudiante:", error)
            return null
        }
    }
    return { getResults, results, getFinalResults  }
}