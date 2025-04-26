import { useContext } from "react"
import { ExamnsContext } from "../context/ExamnsProvider"
import { getApi } from "../services/axiosServices/ApiService"

export const useFetchExamns = () => {
    const { examns, setExamns } = useContext(ExamnsContext)
    const getDataExamns = async () => {
        const response = await getApi(`evaluations/list`)
        setExamns(response)
    }
    const refreshExamns = () => {
        setExamns([])
    }
    return { examns, getDataExamns, refreshExamns }
}