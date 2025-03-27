import { useContext, useEffect, useState } from "react"
import { QuestionContext } from "../../../../context/QuestionsProvider"
import { AnswersContext } from "../../../../context/AnswersProvider"
import { useFetchAnswer } from "../../../../hooks/fetchAnswer"
import ButtonEdit from "../ButtonEdit"


export const Answer = () => {
    const { questions, setQuestions } = useContext(QuestionContext)
    const { answers, setAnswers } = useContext(AnswersContext)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const handleEditClick = (answer) => {
        setSelectedAnswer(answer);
    }

    const {getData} = useFetchAnswer()

    useEffect(() => {
        getData()
    }, [])
    const idEditar = "editarAnswer" 
  return (
    <div className="row">
    <div className="col-12">
      <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Pregunta</th>
            <th scope="col">Respuestas</th>
            <th scope="col">Respuesta correcta</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {answers.length > 0 ? (
            answers.map((answer, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{answer.question}</td>
                <td>{answer.answer}</td>
                <td>{answer.is_correct ? "Si" : "No"}</td>
                <td>
                  <ButtonEdit idEditar={idEditar} handleEditClick={handleEditClick}/>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay respuestas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  )
}
