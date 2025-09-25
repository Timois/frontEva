/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ExamStatusMessage = ({ closedByGroup, stoppedByTeacher, finalScore, studentId }) => {
  
  return (
    <div className="container mt-4">
      <div className="alert alert-info text-center">
        {closedByGroup ? (
          <>
            <h4>La evaluación de este grupo ya fue finalizada.</h4>
            <p>No puedes continuar con el examen.</p>
          </>
        ) : stoppedByTeacher ? (
          <>
            <h4>El docente ha detenido el examen.</h4>
            <p>
              Tu nota final es: <strong>{finalScore}</strong>
            </p>
          </>
        ) : (
          <>
            <h4>Ya has respondido esta evaluación.</h4>
            {finalScore !== null ? (
              <p>
                Tu nota final es: <strong>{finalScore}</strong>
              </p>
            ) : (
              <p>No puedes volver a enviar tus respuestas.</p>
            )}
          </>
        )}
      </div>
      <Link to={`${studentId}/compareAnswers`} className="btn btn-primary">
        Comparar Respuestas
      </Link>
    </div>
  );
};

export default ExamStatusMessage;
