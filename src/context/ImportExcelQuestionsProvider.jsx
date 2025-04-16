/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'

export const ImportExcelQuestionsContext = createContext()

export const ImportExcelQuestionsProvider = ({children}) => {
    const [importExcelQuestions, setImportExcelQuestions] = useState([])
    const [importType, setImportType] = useState('withoutImages')

    const addImportExcel = (import_excel, type) => {
        setImportType(type)
        if (Array.isArray(import_excel)) {
            setImportExcelQuestions(prevQuestions => [...prevQuestions, ...import_excel])
        } else {
            setImportExcelQuestions(prevQuestions => [...prevQuestions, import_excel])
        }
    }

    const clearImportExcel = () => {
        setImportExcelQuestions([])
        setImportType('withoutImages')
    }

    const values = {
        importExcelQuestions,
        importType,
        addImportExcel,
        clearImportExcel,
        setImportExcelQuestions
    }

    return (
        <ImportExcelQuestionsContext.Provider value={values}>
            {children}
        </ImportExcelQuestionsContext.Provider>
    )
}
