/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const PeriodContext = createContext()
export const PeriodProvider = ({children}) => {
    const [periods, setPeriods] = useState([])

    const addPeriod = (period) => {
        setPeriods(prev =>[...prev, period])
    }
    const updatePeriod = (periodo) => {
      const posicion = periods.findIndex(p => p.id === periodo.id)
      if(posicion !== -1){
        const lista = [...periods]
        lista[posicion] = { ...lista[posicion], periodo}
        setPeriods(lista)
      }
    }
    const values = {periods, addPeriod, setPeriods, updatePeriod}
  return (
    <PeriodContext.Provider value={values}>
        {children}
    </PeriodContext.Provider>
  )
}
