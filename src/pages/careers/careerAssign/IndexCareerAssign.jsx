import { useContext, useEffect } from "react"
import { useFetchCareerAssign } from "../../../hooks/fetchCareers"
import { CareerAssigns } from "./CareerAssigns"
import { CareerAssignContext } from "../../../context/CareerAssignProvider"
import { ModalRegisterManagementPeriod } from "../ModalRegisterManagementPeriod"
import { CareerContext } from "../../../context/CareerProvider"


export const IndexCareerAssign = () => {
    const { careerAssignments } = useContext(CareerAssignContext)
    const { selectedCareer } = useContext(CareerContext);
    const { getDataCareerAssignments } = useFetchCareerAssign(selectedCareer.id);

    const modalIdManagementPeriod = "asignarPeriodo"

    useEffect(() => {
        // fetch career assigns
        getDataCareerAssignments()
    }, [])

    return (
        <div className="m-3 p-3">
            <div className="w-100 d-flex justify-content-center">
                <CareerAssigns data={careerAssignments} />
                <ModalRegisterManagementPeriod id={modalIdManagementPeriod} />
            </div>
        </div>
    )
}