/* eslint-disable react/prop-types */
import { createContext, useState } from "react"
export const ResultsContext = createContext()
export const ResultsProvider = ({children}) => {
    const [results, setResults] = useState([])
    
    const values = { results, setResults }
  return (
    <ResultsContext.Provider value={values}>
      {children}
    </ResultsContext.Provider>
  )
}
