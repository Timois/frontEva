import { useContext, useEffect } from "react"
import { useFetchCareerAssign } from "../../../hooks/fetchCareers"
import { CareerAssigns } from "./CareerAssigns"
import { CareerAssignContext } from "../../../context/CareerAssignProvider"
import { useParams } from "react-router-dom"
import { ModalRegisterManagementPeriod } from "../ModalRegisterManagementPeriod"
import CheckPermissions from "../../../routes/CheckPermissions"


export const IndexCareerAssign = () => {
    const { careerAssignments } = useContext(CareerAssignContext)
    const { getDataCareerAssignments } = useFetchCareerAssign()
    const { id } = useParams()
    const modalIdManagementPeriod = "asignarPeriodo"
    
    useEffect(() => {
        getDataCareerAssignments(id)
    }, [id])

    return (
        <div className="m-3 p-3">
            <div className="w-100 d-flex justify-content-center">
                <CheckPermissions requiredPermission="ver-gestiones-asignadas">
                    <CareerAssigns data={careerAssignments} />
                </CheckPermissions>
                <CheckPermissions requiredPermission="asignar-periodos">
                    <ModalRegisterManagementPeriod id={modalIdManagementPeriod} />
                </CheckPermissions>
            </div>
        </div>
    )
}