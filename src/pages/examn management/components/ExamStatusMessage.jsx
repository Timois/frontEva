/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

const ExamStatusMessage = ({ closedByGroup, stoppedByTeacher, finalScore, studentId }) => {
  const navigate = useNavigate();

  const handleCompareClick = () => {
    navigate(`/estudiantes/exams/${studentId}/compareAnswers`);
  };

  const handleBackClick = () => {
    navigate("/estudiantes/exams"); // 👈 vuelve a la lista principal
  }  

  return (
    <div className="container mt-4 text-center">
      <div className="alert alert-info">
        {closedByGroup ? (
          <>
            <h4>El tiempo de esta evaluación ya terminó</h4>
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

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-secondary" onClick={handleBackClick}>
          Volver atrás
        </button>
        <button className="btn btn-primary" onClick={handleCompareClick}>
          Comparar respuestas
        </button>
      </div>
    </div>
  );
};

export default ExamStatusMessage;
