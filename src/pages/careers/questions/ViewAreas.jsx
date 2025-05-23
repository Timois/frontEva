/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApi } from "../../../services/axiosServices/ApiService";
import styles from './AreaCards.module.css';

export const ViewAreas = ({ areas }) => {
  const navigate = useNavigate();
  const [questionCounts, setQuestionCounts] = useState({});

  useEffect(() => {
    const fetchQuestionCounts = async () => {
      try {
        const counts = {};
        const activeAreas = areas?.filter(area => area.status === "activo") || [];
        for (const area of activeAreas) {
          const response = await getApi(`areas/cantityQuestions/${area.id}`);
          counts[area.id] = response || 0;
        }
        setQuestionCounts({ ...counts });
      } catch (error) {
        console.error("Error al obtener cantidad de preguntas:", error);
      }
    };

    if (areas?.length) {
      fetchQuestionCounts();
    }
  }, [areas]);

  const activeAreas = areas?.filter(area => area.status === "activo") || [];

  return (
    <div className="container py-4">
      <div className="row">
        {activeAreas.map((area) => (
          <div key={area.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className={`card shadow-sm border-0 h-100 ${styles.hoverShadow} ${styles.transition}`}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                <h5 className="card-title">{area.name}</h5>
                <div className="badge bg-primary mb-3">
                  {questionCounts[area.id] !== undefined
                    ? `${questionCounts[area.id]} preguntas`
                    : "Cargando..."}
                </div>
                <button
                  className="btn btn-outline-primary mt-3 w-100"
                  onClick={() => navigate(`/administracion/areas/${area.id}/imports`)}
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