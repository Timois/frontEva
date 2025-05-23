/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'
import { getApi } from '../services/axiosServices/ApiService'

export const ImportExcelQuestionsContext = createContext()

export const ImportExcelQuestionsProvider = ({ children }) => {
    const [importExcelQuestions, setImportExcelQuestions] = useState([])

    const addImportExcel = (import_excel) => {
        setImportExcelQuestions(prev => [...prev, import_excel])
    }
    const getData = async () => {
        const response = await getApi("excel_import/list")
        setImportExcelQuestions(response)
    }
    const values = {
        importExcelQuestions,
        addImportExcel,
        setImportExcelQuestions,
        getData
    }

    return (
        <ImportExcelQuestionsContext.Provider value={values}>
            {children}
        </ImportExcelQuestionsContext.Provider>
    )
}
