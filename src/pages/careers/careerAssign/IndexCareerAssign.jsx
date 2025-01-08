import { useContext, useEffect } from "react"
import { useFetchCareerAssign } from "../../../hooks/fetchCareers"
import { CareerAssigns } from "./CareerAssigns"
import { CareerAssignContext } from "../../../context/CareerAssignProvider"
import { useParams } from "react-router-dom"
import { ModalRegisterManagementPeriod } from "../ModalRegisterManagementPeriod"


export const IndexCareerAssign = () => {
    const { careerAssignments } = useContext(CareerAssignContext)
    const { getDataCareerAssignments } = useFetchCareerAssign(useParams().id)

    const modalIdManagementPeriod = "asignarPeriodo"

    useEffect(() => {
        // fetch career assigns
        getDataCareerAssignments()
    }, [])

    return (
        <div className="m-3 p-3">
            <div className="w-100 d-flex justify-content-center">
                <CareerAssigns data={careerAssignments} />
                <ModalRegisterManagementPeriod id={modalIdManagementPeriod}/>
            </div>
        </div>
    )
}