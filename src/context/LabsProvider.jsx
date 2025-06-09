/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const LabsContext = createContext()
export const LabsProvider = ({children}) => {
    const [labs, setLabs] = useState([])

    const addLab = (lab) => {
        setLabs(prev =>[...prev, lab])
    }

    const updateLab = (lab) => {
        const posicion = labs.findIndex(p => p.id === lab.id)
        if (posicion!== -1) {
            const lista = [...labs]
            lista[posicion] = {...lista[posicion],...lab }
            setLabs(lista)
        }
    }

    const values = { labs, addLab, setLabs, updateLab }
  return (
    <LabsContext.Provider value={values}>
      {children}
    </LabsContext.Provider>
  )
}
