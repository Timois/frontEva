/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const UnitContext = createContext()
export const UnitProvider = ({children}) => {
  const [units, setUnits] = useState([])

  const addUnit = (unit) =>{

      setUnits([...units, unit])
  }
  const values = {units, addUnit, setUnits}
  return (
    <UnitContext.Provider value={values}>
      {children}
    </UnitContext.Provider>
  )
}
