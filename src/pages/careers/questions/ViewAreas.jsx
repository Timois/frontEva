/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import styles from './AreaCards.module.css';

export const ViewAreas = ({ areas }) => {
  const navigate = useNavigate();
  
  return (
  <div className="container py-4">
    <div className="row">
      {areas?.map((area) => (
        <div key={area.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div className={`card shadow-sm border-0 h-100 ${styles.hoverShadow} ${styles.transition}`}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
              <h5 className="card-title">{area.name}</h5>
              <button
                className="btn btn-outline-primary mt-3 w-100"
                onClick={() => navigate(`/administracion/areas/${area.id}/questions`)}
              >
                Importar Preguntas
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};