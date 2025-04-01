/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const PermissionsContext = createContext()
export const PermissionsProvider = ({ children }) => {
    const [permisos, setPermisos] = useState([])
    
    const addPermisos = (permiso) =>{
        setPermisos([...permisos, permiso])
    }

    const updatePermiso = (permiso) => {
        const posicion = permisos.findIndex(p => p.id === permiso.id)
        if (posicion !== -1){
            const lista = [...permisos]
            lista[posicion] = { ...lista[posicion], ...permiso}
            setPermisos(lista)
        }
    }
    const values= { permisos, addPermisos, setPermisos, updatePermiso}
  return (
    <PermissionsContext.Provider value={values}>
        {children}
    </PermissionsContext.Provider>
  )
}
