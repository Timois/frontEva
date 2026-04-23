/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

const ExamStatusMessage = ({
  closedByGroup,
  stoppedByTeacher,
  finalScore,
  canViewScore,
  studentId,
  evaluationId
}) => {
  const navigate = useNavigate();

  const handleCompareClick = () => {
    navigate(`/estudiantes/exams/${studentId}/compareAnswers/${evaluationId}`);
  };
  return (
    <div className="container mt-4 text-center">
      <div className="alert alert-info">
        {closedByGroup ? (
          <>
            <h4>El tiempo de esta evaluación ya terminó</h4>
            <p>No puedes continuar con el examen.</p>

            {canViewScore ? (
              <p>Tu nota final es: <strong>{finalScore}</strong></p>
            ) : (
              <p className="text-muted">
                El examen ha finalizado
              </p>
            )}
          </>
        ) : stoppedByTeacher ? (
          <>
            <h4>El examen ha finalizado.</h4>

            {canViewScore ? (
              <p>Tu nota final es: <strong>{finalScore}</strong></p>
            ) : (
              <p className="text-muted">
                El examen has finalizado
              </p>
            )}
          </>
        ) : (
          <>
            <h4>Ya has respondido esta evaluación.</h4>

            {canViewScore ? (
              <p>Tu nota final es: <strong>{finalScore}</strong></p>
            ) : (
              <p className="text-muted">
                El examen ha finalizado
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExamStatusMessage;
