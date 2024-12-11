/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const GestionExtensionContext = createContext()
export const ExtensionGestionProvider = ({children}) => {
    const [gestionsExtension, setGestionsExtension] = useState([])
    const addGestionExtension = (gestionExtension) => {
        setGestionsExtension([...gestionsExtension, gestionExtension])
    }
    const updateGestionExtension = (gestionExtension) => {
        const posicion = gestionsExtension.findIndex(p => p.id === gestionExtension.id)
        if (posicion !== -1){
            const lista = [...gestionsExtension]
            lista[posicion] = { ...lista[posicion], ...gestionExtension}
            setGestionsExtension(lista)
        }
    }
    const values = { gestionsExtension, addGestionExtension,setGestionsExtension, updateGestionExtension}
  return (
    <GestionExtensionContext.Provider value={values}>
        {children}
    </GestionExtensionContext.Provider>
  )
}
