import { useEffect, useState } from "react"
import { useFetchPermission } from "../../hooks/fetchPermissions"
import ButtonEdit from "./ButtonEdit"
import ModalEdit from "./ModalEdit"


export const Permisos = () => {
    const {permisos} = useFetchPermission()
    const [selectedPermiso, setSelectedPermiso] = useState(null)
    const { getData } = useFetchPermission()
    useEffect(() => {
        getData()
    }, [])
    const handleEditClick = (permiso) => {
        setSelectedPermiso(permiso)
    }
    const idEditar = "editarPermiso"
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
                        {permisos.length > 0 ? (
                            permisos.map((permiso, index) => (
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
                <ModalEdit idEditar={idEditar} data={selectedPermiso} title="Editar Permiso" />
            </div>
        </div>
    )
}
