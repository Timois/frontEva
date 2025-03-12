/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const AnswersContext = createContext()
export const AnswersProvider = ({children}) => {
    const [answers, setAnswers] = useState([])

    const addAnswer = (answer) => {
        setAnswers([...answers, answer])
    }

    const updateAnswer = (answer) => {
        const position = answers.findIndex(a => a.id === answer.id)
        if (position !== -1) {
            const list = [...answers]
            list[position] = { ...list[position], ...answer }
            setAnswers(list)
        }
    }   
    const values = { answers, addAnswer, setAnswers, updateAnswer }
  return (
    <AnswersContext.Provider value={values}>
        {children}
    </AnswersContext.Provider>
  )
}
