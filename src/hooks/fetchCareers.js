/* eslint-disable no-unused-vars */
import { useContext } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { CareerContext } from "../context/CareerProvider"
import { CareerAssignContext } from "../context/CareerAssignProvider"
import { PeriodAssignContext } from "../context/PeriodAssignProvider"

export const useFetchCareer = () => {

    const { careers, setCareers } = useContext(CareerContext)
    const getDataCareer = async () => {
        const response = await getApi("career/list")
        if (response.length > 0) {
            setCareers(response)
        }
        return careers
    }
    return { careers, getDataCareer}

}

export const useFetchCareerAssign = (id) => {
    const { careerAssignments, setCareerAssignments } = useContext(CareerAssignContext)
    const getDataCareerAssignments = async () => {
        const response = await getApi(`career/findByAssignId/${id}`)
        setCareerAssignments(response)
    }
    return { careerAssignments, getDataCareerAssignments }

}

export const useFetchPeriodAssign = (id) => {
    const { periodAssignments, setPeriodAssignments } = useContext(PeriodAssignContext)
    const getDataPeriodAssignments = async () => {
        const response = await getApi(`academic_management_period/find/${id}`)
        setPeriodAssignments(response)
    }
    return { periodAssignments,  getDataPeriodAssignments}
}