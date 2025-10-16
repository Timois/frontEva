/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const GroupContext = createContext()
export const GroupsProvider = ({children}) => {
    const [groups, setGroups] = useState([])

    const addGroup = (group) => {
        setGroups(prev =>[...prev, group])
    }
    const updateGroup = (group) => {
        const posicion = groups.findIndex(p => p.id === group.id)
        if (posicion!== -1) {
            const lista = [...groups]
            lista[posicion] = {...lista[posicion],...group }
            setGroups(lista)
        }   
    }

    const values = { groups, addGroup, setGroups, updateGroup }
  return (
    <GroupContext.Provider value={values}>
        {children}
    </GroupContext.Provider>
  )
}
