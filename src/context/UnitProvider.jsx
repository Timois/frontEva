/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const UnitContext = createContext()
export const UnitProvider = ({children}) => {
  const [units, setUnits] = useState([])

  const addUnit = (unit) =>{
      setUnits([...units, unit])
  }
  const updateUnit = (unit) =>{
    const posicion = units.findIndex(p => p.id === unit.id)
    if(posicion !== -1)
    {
      const lista = [...units];
      lista[posicion] = { ...lista[posicion], ...unit}
      setUnits(lista)
    }
  }

  const values = {units, addUnit, setUnits, updateUnit}
  return (
    <UnitContext.Provider value={values}>
      {children}
    </UnitContext.Provider>
  )
}
