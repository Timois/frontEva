/* eslint-disable react/prop-types */
const SubmitSection = ({ loading, socketTimeData, examStarted, handleSubmit }) => (
  <div className="d-flex justify-content-center mb-4">
    <button
      className="btn btn-primary px-5 py-3 rounded-pill fw-bold"
      disabled={loading || (socketTimeData?.timeLeft <= 0) || !examStarted}
      onClick={handleSubmit}
    >
      {!examStarted
        ? "Esperando inicio del examen..."
        : socketTimeData?.timeLeft <= 0
        ? "Tiempo Agotado"
        : loading
        ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
        : "Enviar Respuestas"}
    </button>

    {socketTimeData && examStarted && (
      <div className="ms-3 d-flex flex-column justify-content-center">
        <small className="text-muted">
          Estado: <span className="text-primary">{socketTimeData.examStatus}</span>
        </small>
        {socketTimeData.serverTime && (
          <small className="text-muted">Hora servidor: {socketTimeData.serverTime}</small>
        )}
      </div>
    )}
  </div>
);

export default SubmitSection;
