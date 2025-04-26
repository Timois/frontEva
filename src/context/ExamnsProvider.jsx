/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const ExamnsContext = createContext()
export const ExamnsProvider = ({children}) => {
    const [examns, setExamns] = useState([])
    const addExamn = (examn) => {
        setExamns(prev => [...prev, examn])
    }

    const updateExamn = (examn) => {
        const position = examns.findIndex(e => e.id === examn.id)
        if (position !== -1) {
            const list = [...examns]
            list[position] = { ...list[position], ...examn }
            setExamns(list)
        }
    }
    const values = { examns, addExamn, setExamns, updateExamn }
  return (
    <ExamnsContext.Provider value={values}>
      {children}
    </ExamnsContext.Provider>
  )
}
