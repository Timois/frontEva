/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react"
import { PersonaContext } from "../../context/PersonaProvider"
import { useFetchPersona } from "../../hooks/fetchPersona"
import ButtonEdit from "./ButtonEdit"
import { RolContext } from "../../context/RolesProvider"


export const User = () => {
    const {roles, setRoles} = useContext(RolContext)
    const { personas, setPersonas } = useContext(PersonaContext)
    const { selectedPersona, setSelectedpersona } = useState(null)
    const { getData } = useFetchPersona()

    useEffect(() => {
        getData()
    }, [])

    const handleEditClick = (persona) => {
        setSelectedpersona(persona)
      }
    const idEditar = "editarUsuario"
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
                            <th scope="col">Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personas.length > 0 ? (
                            personas.map((persona, index) => (
                                <tr key={persona}>
                                    <td>{index + 1}</td>
                                    <td>{persona.name}</td>
                                    <td>{persona.email}</td>
                                    <td>{persona.role}</td>
                                    <td>{persona.career_id}</td>
                                    <td>
                                        <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(personas)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No hay Usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
