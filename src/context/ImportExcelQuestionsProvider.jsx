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
    const getData = async ({ area_id }) => {
        try {
            const response = await getApi(`excel_import/list/${area_id}`)
            if (response) {
                setImportExcelQuestions([...response])
            }
        } catch (error) {
            console.error("Error al obtener archivos importados:", error)
        }
    }
    const getArea = async (excel_id) => {
        try {
            const response = await getApi(`excel_import/findAreaByExcel/${excel_id}`)
            if (response) {
                return response
            }
        } catch (error) {
            console.error("Error al obtener archivos importados:", error)
        }
    }
    const values = {
        importExcelQuestions,
        addImportExcel,
        setImportExcelQuestions,
        getData,
        getArea
    }

    return (
        <ImportExcelQuestionsContext.Provider value={values}>
            {children}
        </ImportExcelQuestionsContext.Provider>
    )
}
