/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {createContext, useState } from 'react'
import propTypes from 'prop-types'

export const PeriodAssignContext = createContext();

export const PeriodAssignProvider = ({ children }) => {
    const [periodAssigments, setPeriodAssigments] = useState([])

    const addAssignment = (assigment) => {
        setPeriodAssigments([...periodAssigments, assigment])
    }

    const removeAssignment = (id) => {
        setPeriodAssigments(periodAssigments.filter(assigment => assigment.id !== id))
    }

  return (
    <PeriodAssignContext.Provider value={{periodAssigments, addAssignment, removeAssignment, setPeriodAssigments}}>
        {children}
    </PeriodAssignContext.Provider>

  )
}
PeriodAssignProvider.propTypes = {
    children: propTypes.node,
}