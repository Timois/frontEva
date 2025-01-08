
import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { CareerContext } from "../context/CareerProvider"
import { CareerAssignContext } from "../context/CareerAssignProvider"
import { PeriodAssignContext } from "../context/PeriodAssignProvider"

export const useFetchCareer = () => {

    const { careers, setCareers } = useContext(CareerContext)
    const getDataCareer = async () => {

        if (careers.length < 1) {
            const response = await getApi("career/list")
            setCareers(response)
        }
        return careers
    }
    return { careers, getDataCareer }

}

export const useFetchCareerAssign = (id) => {
    const { careerAssignments, setCareerAssignments } = useContext(CareerAssignContext)
    const getDataCareerAssignments = async () => {
        const response = await getApi(`career/findByAssignId/${id}`)
        setCareerAssignments(response)
    }
    return { careerAssignments, getDataCareerAssignments }

}

export const useFetchCareerAssignPeriod = (id) => {
    const { careerAssignmentsPeriods, setCareerAssignmentsPeriods } = useContext(CareerAssignContext)
    const getDataCareerAssignmentPeriods = async () => {
        const response = await getApi(`career/findPeriodByIdAssign/${id}`)
        setCareerAssignmentsPeriods(response)
    }
    return { careerAssignmentsPeriods, getDataCareerAssignmentPeriods }
}

export const useFetchPeriodAssign = (id) => {
    const { periodAssignments, setPeriodAssignments } = useContext(PeriodAssignContext)
    const getDataPeriodAssignments = async () => {
        const response = await getApi(`academic_management_period/find/${id}`)
        setPeriodAssignments(response)
    }
    return { periodAssignments, getDataPeriodAssignments }
}