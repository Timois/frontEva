import { useEffect, useState } from "react"
import { fetchLabs } from "../../hooks/fetchLabs"
import { FaLaptopCode } from "react-icons/fa"
import ButtonEdit from "./ButtonEdit"
import ModalEdit from "./ModalEdit"


export const Labs = () => {
    const [selectedLab, setSelectedLab] = useState(null)
    const { labs, getDataLabs } = fetchLabs()
    
    useEffect(() => {
        getDataLabs()
    }, [])

    const handleEditClick = (data) => {
        setSelectedLab(data)
    }

    const idEditar = 'editLab'
    return (
        <div className="container-fluid p-4">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top">
                    <h3 className="mb-0">
                        <FaLaptopCode className="me-2" />
                        Gestión de Laboratorios
                    </h3>
                </div>

                <div className="table-responsive rounded-3">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th scope="col" width="10%" className="text-center fw-medium text-primary">N°</th>
                                <th scope="col" className="fw-medium text-primary">Nombre</th>
                                <th scope="col" className="fw-medium text-primary">Ubicacion</th>
                                <th scope="col" className="fw-medium text-primary">Cantidad de equipos</th>
                                <th scope="col" width="20%" className="text-center fw-medium text-primary">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labs.length > 0 ? (
                                labs.map((lab, index) => (
                                    <tr key={index} className="transition-all">
                                        <td className="text-center text-muted">{index + 1}</td>
                                        <td className="fw-semibold text-uppercase">{lab.name}</td>
                                        <td className="fw-semibold text-capitalize">{lab.location}</td>
                                        <td className="fw-semibold">{lab.equipment_count}</td>
                                        <td className="text-center">
                                            <ButtonEdit
                                                idEditar={idEditar}
                                                onEditClick={() => handleEditClick(lab)}
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
                                            <FaLaptopCode className="fs-1 mb-2" />
                                            No hay laboratorios registrados.
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
                data={selectedLab}
                title="Editar Laboratorio"
            />
        </div>
    )
}
