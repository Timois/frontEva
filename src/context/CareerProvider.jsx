/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const CareerContext = createContext()
export const CareerProvider = ({ children }) => {
  const [careers, setCareers] = useState([])
  const [selectedCareer, setSelectedCareer] = useState(null)

  const addCareer = (career) => {
    setCareers([...careers, career])
  }

  const updateSelectedCareer = (career) => {
    setSelectedCareer(career);
  }

  const updateCareer = (career) => {
    const posicion = careers.findIndex(p => p.id === career.id)
    if (posicion !== -1) {
      const lista = [...careers]
      lista[posicion] = { ...lista[posicion], ...career }
      setCareers(lista)
    }
  }

  const values = { careers, addCareer, setCareers, updateCareer, selectedCareer, updateSelectedCareer }

  return (
    <CareerContext.Provider value={values}>
      {children}
    </CareerContext.Provider>
  )
}
