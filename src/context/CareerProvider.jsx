/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const CareerContext = createContext()
export const CareerProvider = ({children}) => {
    const [careers, setCareers] = useState([])
    const addCareer = (career) => {
        setCareers([...careers, career])
    }
    const values = {careers, addCareer, setCareers}
  return (
    <CareerContext.Provider value={values}>
        {children}
    </CareerContext.Provider>
  )
}
