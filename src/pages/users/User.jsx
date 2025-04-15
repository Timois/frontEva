/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react"
import { PersonaContext } from "../../context/PersonaProvider"
import { useFetchPersona } from "../../hooks/fetchPersona"
import ButtonEdit from "./ButtonEdit"
import { ButtonAssign } from "./ButtonAssign"
import { ModalAsign } from "./ModalAsign"
import ModalEdit from "./ModalEdit"
import { CareerContext } from "../../context/CareerProvider"
import CheckPermissions from "../../routes/CheckPermissions"

export const User = () => {
    const { personas, setPersonas } = useContext(PersonaContext)
    const [selectedPersona, setSelectedPersona] = useState(null)
    const { getData } = useFetchPersona()
    const { careers } = useContext(CareerContext)

    useEffect(() => {
        getData()
    }, [])

    const handleEditClick = (persona) => {
        setSelectedPersona(persona)
    }

    // Buscar nombre de carrera según career_id
    const getCareerName = (career_id) => {
        const career = careers.find(c => c.id === career_id)
        return career ? career.name : "No asignada"
    }

    // Función para obtener los nombres de los roles de un usuario
    const getRoleNames = (roles) => {
        if (!roles || roles.length === 0) {
            return "Sin rol asignado"
        }
        return roles.map(role => role.name).join(", ")
    }

    const idEditar = "editarUsuario"
    const modalAsign = "asignarCarrera"

    return (
        <div className="row">
            <div className="col-12">
                <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
                    <thead>
                        <tr>
                            <th scope="col">N°</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Unidad</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personas.length > 0 ? (
                            personas.map((persona, index) => (
                                <tr key={persona.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{persona.name}</td>
                                    <td>{persona.email}</td>
                                    <td>{getRoleNames(persona.roles)}</td>
                                    <td>
                                        {getCareerName(persona.career_id)}
                                        {!persona.career_id && (
                                            <CheckPermissions requiredPermission="asignar-carreras-a-usuarios">
                                                <ButtonAssign modalId={modalAsign} persona={persona} />
                                            </CheckPermissions>
                                        )}
                                    </td>
                                    <td>{persona.status}</td>
                                    <td>
                                        <CheckPermissions requiredPermission="editar-usuarios">
                                            <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(persona)} />
                                        </CheckPermissions>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No hay Usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <CheckPermissions requiredPermission="asignar-carreras-a-usuarios">
                    <ModalAsign modalId={modalAsign} title="Asignar carrera" data={selectedPersona} />
                </CheckPermissions>
                <CheckPermissions requiredPermission="editar-usuarios">
                    <ModalEdit idEditar={idEditar} title="Editar Usuario" data={selectedPersona} />
                </CheckPermissions>
            </div>
        </div >
    )
}
