/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const GestionContext = createContext()
export const GestionProvider = ({ children }) => {
    const [gestions, setGestions] = useState([])
    const addGestion = (gestion) => {
        setGestions(prev => [...prev, gestion])
    }
    const updateGestion = (gestion) => {
        const posicion = gestions.findIndex(p => p.id === gestion.id)
        if (posicion !== -1){
            const lista = [...gestions]
            lista[posicion] = { ...lista[posicion], ...gestion}
            setGestions(lista)
        }
    }
    const values = { gestions, addGestion, setGestions, updateGestion}
    return (
        <GestionContext.Provider value={values}>
            {children}
        </GestionContext.Provider>
    )
}
