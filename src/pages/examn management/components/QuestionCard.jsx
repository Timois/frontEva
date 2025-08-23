/* eslint-disable react/prop-types */
import { FaCheck } from "react-icons/fa";

const QuestionCard = ({ question, index, API_BASE_URL, selectedAnswers, examStarted, handleAnswerSelection }) => (
  <div className="card shadow-sm border-0 rounded-3 mb-4 overflow-hidden">
    <div className="card-header bg-light py-3">
      <h5 className="mb-0 d-flex align-items-center">
        <span className="badge bg-primary bg-opacity-10 text-primary me-3 py-2 px-3">
          Pregunta {index + 1}
        </span>
        <strong>{question.question}</strong>
      </h5>
      <span>{question.description}</span>
    </div>
    <div className="card-body">
      {question.image && (
        <div className="mb-3 text-center">
          <img
            src={`${API_BASE_URL}${question.image}`}
            alt="Imagen"
            className="img-fluid rounded shadow-sm border"
            style={{ maxHeight: "200px" }}
          />
        </div>
      )}
      <h6 className="mb-3 text-muted">Selecciona una respuesta:</h6>
      {question.answers.map((answer, i) => (
        <div
          key={answer.id}
          className={`p-3 mb-3 rounded-3 cursor-pointer ${
            selectedAnswers[question.question_id] === answer.id
              ? "bg-primary bg-opacity-10 border border-primary"
              : "bg-light border"
          } ${!examStarted ? "opacity-50" : ""}`}
          onClick={() =>
            examStarted && handleAnswerSelection(question.question_id, answer.id)
          }
          role="button"
          style={{ cursor: examStarted ? "pointer" : "not-allowed" }}
        >
          <div className="d-flex align-items-center">
            <div
              className={`me-3 ${
                selectedAnswers[question.question_id] === answer.id
                  ? "text-primary"
                  : "text-muted"
              }`}
            >
              {selectedAnswers[question.question_id] === answer.id ? (
                <FaCheck className="fs-5" />
              ) : (
                <strong>{String.fromCharCode(65 + i)}.</strong>
              )}
            </div>
            <div>{answer.answer}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default QuestionCard;
