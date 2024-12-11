/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const PeriodContext = createContext()
export const PeriodProvider = ({children}) => {
    const [periods, setPeriods] = useState([])

    const addPeriod = (period) => {
        setPeriods([...periods, period])
    }
    const values = {periods, addPeriod, setPeriods}
  return (
    <PeriodContext.Provider value={values}>
        {children}
    </PeriodContext.Provider>
  )
}
