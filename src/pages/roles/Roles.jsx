import { useEffect, useState } from "react"
import { useFetchRol } from "../../hooks/fetchRoles"
import ButtonEdit from "./ButtonEdit"
import ModalEdit from "./ModalEdit"


export const Roles = () => {
    const { roles } = useFetchRol()
    const [selectedRol, setSelectedRol] = useState(null)
    const { getData } = useFetchRol()
    useEffect(() => {
        getData()
    }, [])

    const handleEditClick = (rol) => {
        setSelectedRol(rol)
    }
    const idEditar = "editarRol"
  return (
    <div className="row">
            <div className="col-12">
                <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
                    <thead>
                        <tr>
                            <th scope="col">N°</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length > 0 ? (
                            roles.map((permiso, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{permiso.name}</td>
                                    <td>
                                        <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(permiso)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No hay Permisos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <ModalEdit idEditar={idEditar} data={selectedRol} title="Editar Permiso" />
            </div>
        </div>
  )
}
