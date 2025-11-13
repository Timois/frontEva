/* eslint-disable react/prop-types */
const SubmitSection = ({ loading, socketTimeData, examStarted, handleSubmit }) => (
  <div className="d-flex justify-content-center mb-4">
    <button
      className="btn btn-primary px-5 py-3 rounded-pill fw-bold"
      disabled={loading || (socketTimeData?.timeLeft <= 0) || !examStarted}
      onClick={(e) => handleSubmit(e, true)} 
    >
      {!examStarted
        ? "Esperando inicio del examen..."
        : socketTimeData?.timeLeft <= 0
        ? "Tiempo Agotado"
        : loading
        ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
        : "Enviar Respuestas"}
    </button>
  </div>
);

export default SubmitSection;
