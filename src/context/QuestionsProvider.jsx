/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const QuestionContext = createContext()
export const QuestionsProvider = ({children}) => {
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState({})
    const addQuestion = (question) => {
        setQuestions([...questions, question])
    }

    const updateQuestion = (question) => {
        const posicion = questions.findIndex(p => p.id === question.id)
        if (posicion !== -1) {
            const lista = [...questions]
            lista[posicion] = { ...lista[posicion], ...question }
            setQuestions(lista)
        }
    }

    const values = {questions, addQuestion, setQuestions, updateQuestion, question, setQuestion}
  return (
    <QuestionContext.Provider value={values}>
        {children}
    </QuestionContext.Provider>
  )
}
