/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react"
import { PersonaContext } from "../../context/PersonaProvider"
import { useFetchPersona } from "../../hooks/fetchPersona"
import ButtonEdit from "./ButtonEdit"
import { ButtonAssign } from "./ButtonAssign"
import { ModalAsign } from "./ModalAsign"
import ModalEdit from "./ModalEdit"
import { FaUserShield, FaLink, FaEdit } from "react-icons/fa";
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
        <div className="container-fluid p-4">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top">
                    <h3 className="mb-0">Gestión de Usuarios</h3>
                </div>

                <div className="table-responsive rounded-3">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th scope="col" className="text-center fw-medium text-primary">#</th>
                                <th scope="col" className="fw-medium text-primary">Nombre</th>
                                <th scope="col" className="fw-medium text-primary">Correo</th>
                                <th scope="col" className="fw-medium text-primary">Roles</th>
                                <th scope="col" className="fw-medium text-primary">Unidad</th>
                                <th scope="col" className="fw-medium text-primary">Estado</th>
                                <th scope="col" className="text-center fw-medium text-primary">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personas.length > 0 ? (
                                personas.map((persona, index) => (
                                    <tr key={persona.id || index} className="transition-all">
                                        <td className="text-center text-muted">{index + 1}</td>
                                        <td className="fw-semibold">{persona.name}</td>
                                        <td>
                                            <a href={`mailto:${persona.email}`} className="text-decoration-none">
                                                {persona.email}
                                            </a>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-2">
                                                {persona.roles?.map(role => (
                                                    <span
                                                        key={role.id}
                                                        className="badge bg-info bg-opacity-10 text-info rounded-pill"
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="text-muted">
                                                    {getCareerName(persona.career_id) || "Sin asignar"}
                                                </span>
                                                {!persona.career_id && (
                                                    <CheckPermissions requiredPermission="asignar-carreras-a-usuarios">
                                                        <ButtonAssign
                                                            modalId={modalAsign}
                                                            persona={persona}
                                                            className="btn-link text-primary p-0"
                                                        />
                                                    </CheckPermissions>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${persona.status === 'active'
                                                ? 'bg-success bg-opacity-10 text-success'
                                                : 'bg-danger bg-opacity-10 text-danger'} rounded-pill`}
                                            >
                                                {persona.status}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex gap-2 justify-content-center">
                                                <CheckPermissions requiredPermission="editar-usuarios">
                                                    <ButtonEdit
                                                        idEditar={idEditar}
                                                        onEditClick={() => handleEditClick(persona)}
                                                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                                    />
                                                </CheckPermissions>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center text-muted">
                                            <FaUserShield className="fs-1 mb-2" />
                                            No se encontraron usuarios
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals (permanecen igual pero con mejor estilo) */}
            <CheckPermissions requiredPermission="asignar-carreras-a-usuarios">
                <ModalAsign
                    modalId={modalAsign}
                    title={<><FaLink className="me-2" />Asignar carrera</>}
                    data={selectedPersona}
                />
            </CheckPermissions>

            <CheckPermissions requiredPermission="editar-usuarios">
                <ModalEdit
                    idEditar={idEditar}
                    title={<><FaEdit className="me-2" />Editar Usuario</>}
                    data={selectedPersona}
                />
            </CheckPermissions>
        </div>
    )
}
