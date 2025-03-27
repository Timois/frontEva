/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const RolContext = createContext()
export const RolesProvider = ({children}) => {
    const [roles, setRoles] = useState([])

    const addRol = (rol) => {
        setRoles([...roles, rol])
    }

    const updateRol = (rol) => {
        const posicion = roles.findIndex(p => p.id === rol.id)
        if (posicion !== -1){
            const lista = [...roles]
            lista[posicion] = { ...lista[posicion], ...rol}
            setRoles(lista)
        }
    }
    const values = { roles, addRol, setRoles, updateRol}
  return (
    <RolContext.Provider value={values}>
        {children}
    </RolContext.Provider>
  )
}
