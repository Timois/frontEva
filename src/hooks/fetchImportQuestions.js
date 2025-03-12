import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { ImportExcelQuestionsContext } from "../context/ImportExcelQuestionsProvider"

export const useFetchImportQuestions = () => {
    const { importExcelQuestions, setImportExcelQuestions } = useContext(ImportExcelQuestionsContext)
    const getData = async () => {
        if (importExcelQuestions.length < 1) {
            const response = await getApi("excel_import/list")
            setImportExcelQuestions(response)
        }
        return importExcelQuestions
    }
    return { importExcelQuestions, getData }
}