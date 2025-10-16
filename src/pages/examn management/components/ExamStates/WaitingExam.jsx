import { useNavigate } from "react-router-dom";

const WaitingExam = () => {
  const navigate = useNavigate(); // ✅ mover aquí

  return (
    <div className="container mt-4 text-center">
      <button className="btn btn-primary mb-3" onClick={() => navigate(-1)}>
        Volver
      </button>
      <h4>Esperando inicio del examen...</h4>
      <p>Permanece en esta ventana. El examen comenzará pronto.</p>
    </div>
  );
};

export default WaitingExam;
