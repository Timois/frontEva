import { FaClock } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const LoadingComponent = ({ title }) => (
  <div className="container mt-4">
    <div className="alert alert-warning text-center">
      <h4>Evaluación: {title}</h4>
      <div className="d-flex justify-content-center align-items-center mt-3">
        <FaClock className="me-2 fs-4" />
        <p className="mb-0">El examen está listo. Esperando que el instructor inicie la evaluación...</p>
      </div>
      <div className="spinner-border text-primary mt-3" role="status">
        <span className="visually-hidden">Esperando...</span>
      </div>
    </div>
  </div>
);

export default LoadingComponent;
