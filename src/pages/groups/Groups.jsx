import { useEffect, useState } from "react"
import { fetchGroupByEvaluation } from "../../hooks/fetchGroup"
import { useParams } from "react-router-dom"
import { FaObjectGroup } from "react-icons/fa"
import ButtonEdit from "./ButtonEdit"
import ModalEdit from "./ModalEdit"
import ModalRegister from "./ModalRegister"
import ButtonAdd from "./ButtonAdd"
export const Groups = () => {
    const { id } = useParams()
    const evaluationId = id
    const [selectedGroup, setSelectedGroup] = useState(null)
    const handleEditClick = (group) => setSelectedGroup(group)
    const { groups, getDataGroupEvaluation } = fetchGroupByEvaluation()
    useEffect(() => {
        getDataGroupEvaluation(evaluationId)
    }, [evaluationId])
    const idEditar = "editGroup"
    const modalRegister = "registerGroup"
    return (
        <div className="container-fluid p-4">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top">
                    <h3 className="mb-0">
                        <FaObjectGroup className="me-2" />
                        Gestión de Grupos
                    </h3>
                </div>

                <div className="table-responsive rounded-3">
                    <ButtonAdd modalId={modalRegister} />
                    <ModalRegister modalId={modalRegister} title="Registrar Grupos"/>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th scope="col" width="10%" className="text-center fw-medium text-primary">N°</th>
                                <th scope="col" className="fw-medium text-primary">Nombre</th>
                                <th scope="col" className="fw-medium text-primary">Descripcion</th>
                                <th scope="col" className="fw-medium text-primary">Hora de Inicio</th>
                                <th scope="col" className="fw-medium text-primary">Hora de Fin</th>
                                <th scope="col" width="20%" className="text-center fw-medium text-primary">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.length > 0 ? (
                                groups.map((group, index) => (
                                    <tr key={index} className="transition-all">
                                        <td className="text-center text-muted">{index + 1}</td>
                                        <td className="fw-semibold">{group.name}</td>
                                        <td className="fw-semibold">{group.description}</td>
                                        <td className="fw-semibold">{group.start_time}</td>
                                        <td className="fw-semibold">{group.end_time}</td>
                                        <td className="text-center">
                                            <ButtonEdit
                                                idEditar={idEditar}
                                                onEditClick={() => handleEditClick(group)}
                                                className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                                            >
                                            </ButtonEdit>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center text-muted">
                                            <FaObjectGroup className="fs-1 mb-2" />
                                            No hay periodos registrados.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ModalEdit
                idEditar={idEditar}
                examn={selectedGroup}
                title="Editar Periodo"
            />
        </div>
    )
}
