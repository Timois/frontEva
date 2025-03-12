/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const PersonaContext = createContext()
export const PersonaProvider = ({children}) => {
  const [ personas, setPersonas ] = useState([])
  const addPersona = (persona) => {
    setPersonas([...personas, persona])
  }

  const updatePersona = (persona) => {
    const posicion = personas.findIndex(p => p.id === persona.id)
    if(posicion !== -1){
      const lista = [...personas]
      lista[posicion] = { ...lista[posicion], ...persona}
      setPersonas(lista)
    }
  }

  const values = { personas, setPersonas, addPersona, updatePersona}

  return (
    <PersonaContext.Provider value={values}>
      {children}
    </PersonaContext.Provider>
  )
}
