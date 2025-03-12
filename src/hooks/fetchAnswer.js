
import { useContext } from "react"
import { AnswersContext } from "../context/AnswersProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchAnswer = () => {
    const { answers, setAnswers } = useContext(AnswersContext)
    const getData = async () => {
        if (answers.length < 1) {
            const response = await getApi("bank_answers/list")
            setAnswers(response)
        }
        return answers
    }
    return { answers, getData }
}