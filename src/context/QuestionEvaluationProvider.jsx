/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const AssignQuestionsContext = createContext();
export const QuestionEvaluationProvider = ({children}) => {
    const [assignQuestions, setAssignQuestions] = useState([]);

    const addAssignQuestion = (assignQuestion) => {
        setAssignQuestions(prev => [...prev, assignQuestion]);
    };

    const values = {addAssignQuestion, assignQuestions, setAssignQuestions};
  return (
    <AssignQuestionsContext.Provider value={values}>
        {children}
    </AssignQuestionsContext.Provider>
  )
}
