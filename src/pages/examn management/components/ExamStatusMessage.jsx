/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
const ExamStatusMessage = ({ closedByGroup, stoppedByTeacher, finalScore, studentId }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/estudiantes/exams/${studentId}/compareAnswers`);
  };

  return (
    <div className="container mt-4">
      <div className="alert alert-info text-center">
        {closedByGroup ? (
          <>
            <h4>El tiempo de esta evaluacion ya termino</h4>
            <p>No puedes continuar con el examen.</p>
            <p> 
              Tu nota final es: <strong>{finalScore}</strong>
            </p>
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
      <button className="btn btn-primary" onClick={handleClick}>
        Comparar respuestas
      </button>
    </div>
  );
};

export default ExamStatusMessage;
