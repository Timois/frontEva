/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'
import { set } from 'zod'
export const ImportExcelQuestionsContext = createContext()
export const ImportExcelQuestions = () => {
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
