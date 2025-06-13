/* eslint-disable react/prop-types */

/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'
export const AreaContext = createContext()
export const AreaProvider = ({ children }) => {
    const [areas, setAreas] = useState([])
    const [area, setArea] = useState({})
    const addArea = (area) => {
        setAreas([...areas, area])
    }
    
    const updateArea = (area) => {
        const posicion = areas.findIndex(p => p.id === area.id)
        if (posicion !== -1) {
            const lista = [...areas]
            lista[posicion] = { ...lista[posicion], ...area }
            setAreas(lista)
        }
    }

    const values = { areas, addArea, setAreas, updateArea, area, setArea }
  return (
    <AreaContext.Provider value={values}>
        {children}
    </AreaContext.Provider>
  )
}
