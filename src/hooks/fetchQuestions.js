import { useContext } from "react"
import { QuestionContext } from "../context/QuestionsProvider"
import { getApi } from "../services/axiosServices/ApiService"
import { AreaContext } from "../context/AreaProvider"

export const useFetchQuestions = () => {
    const { questions, setQuestions } = useContext(QuestionContext)
    const getData = async () => {
        if (questions.length < 1) {
            const response = await getApi("bank_questions/list")
            setQuestions(response)
        }
        return questions
    }

    return { questions, getData }
}

export const useFetchQuestionsByArea = () => {
    const { areas, setAreas } = useContext(AreaContext)

    const getData = async (area_id) => {
        const response = await getApi(`areas/listQuestions/${area_id}`)
        setAreas(response)
        return response
    }
    return { areas, getData}
}   