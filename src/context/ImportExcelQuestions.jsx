/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'
export const ImportExcelQuestionsContext = createContext()
export const ImportExcelQuestions = ({children}) => {
    const [importExcelQuestions, setImportExcelQuestions] = useState([])
    const importQuestions = (import_excel) => {
        setImportExcelQuestions(import_excel)
    }

    const values = {importExcelQuestions, setImportExcelQuestions}
  return (
    <ImportExcelQuestionsContext.Provider value={values}>
        {children}
    </ImportExcelQuestionsContext.Provider>
  )
}
