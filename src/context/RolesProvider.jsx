/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react"
 
export const RolContext = createContext()
export const RolesProvider = ({children}) => {
    const [roles, setRoles] = useState([])
    const [userRoles, setUserRoles] = useState([])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role) {
            setUserRoles(Array.isArray(user.role) ? user.role : [user.role]);
        }
    }, []);

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

    const values = { 
        roles, 
        addRol, 
        setRoles, 
        updateRol, 
        userRoles 
    }
    
    return (
        <RolContext.Provider value={values}>
            {children}
        </RolContext.Provider>
    )
}