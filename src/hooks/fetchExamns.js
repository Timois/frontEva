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
          const response = await getApi("evaluations/list")
          setExamns(response)
      }  
    
    return { examns, getDataExamns, refreshExamns }
}