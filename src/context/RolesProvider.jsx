/* eslint-disable react/prop-types */
import { createContext, useState } from "react"
 
export const RolContext = createContext()
export const RolesProvider = ({children}) => {
    const [roles, setRoles] = useState([])

    const addRol = (rol) => {
        setRoles([...roles, rol])
    }

    const updateRol = (updatedRol) => {
        setRoles(prevRoles => 
            prevRoles.map(rol => 
                rol.id === updatedRol.id 
                    ? { ...rol, ...updatedRol, permissions: updatedRol.permissions }
                    : rol
            )
        );
    }

    const values = { roles, addRol, setRoles, updateRol}
    return (
        <RolContext.Provider value={values}>
            {children}
        </RolContext.Provider>
    )
}