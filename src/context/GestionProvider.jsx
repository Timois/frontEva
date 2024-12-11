/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const GestionContext = createContext()
export const GestionProvider = ({ children }) => {
    const [gestions, setGestions] = useState([])
    const addGestion = (gestion) => {
        setGestions([...gestions, gestion])
    }
    const values = { gestions, addGestion, setGestions }
    return (
        <GestionContext.Provider value={values}>
            {children}
        </GestionContext.Provider>
    )
}
