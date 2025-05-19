
import { FaLayerGroup, FaUserGraduate, FaQuestionCircle } from "react-icons/fa";

export const InicioDocente = () => {
  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Bienvenido Docente</h1>
        <p className="text-muted">Desde aquí puedes gestionar las áreas, importar estudiantes y administrar las preguntas para las evaluaciones.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <FaLayerGroup size={40} className="text-primary mb-3" />
              <h5 className="card-title">Áreas de Evaluación</h5>
              <p className="card-text text-muted">Crea las áreas temáticas que estarán disponibles en las evaluaciones para tu carrera.</p>
              <a href="/areas" className="btn btn-sm btn-outline-primary">Gestionar Áreas</a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <FaUserGraduate size={40} className="text-success mb-3" />
              <h5 className="card-title">Importar Estudiantes</h5>
              <p className="card-text text-muted">Importa desde un archivo a los estudiantes pertenecientes a tu carrera.</p>
              <a href="/importar-estudiantes" className="btn btn-sm btn-outline-success">Importar</a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <FaQuestionCircle size={40} className="text-warning mb-3" />
              <h5 className="card-title">Preguntas de Evaluación</h5>
              <p className="card-text text-muted">Crea preguntas o importa un conjunto de preguntas para los exámenes.</p>
              <a href="/preguntas" className="btn btn-sm btn-outline-warning">Gestionar Preguntas</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
