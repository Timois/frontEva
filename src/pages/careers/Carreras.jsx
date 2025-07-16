/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { CareerContext } from "../../context/CareerProvider";
import ButtonEdit from "./ButtonEdit";
import { ModalEdit } from "./ModalEdit";
import { useFetchCareer } from "../../hooks/fetchCareers";
import { ButtonVerGestion } from "./ButtonVerGestion";
import CheckPermissions from "../../routes/CheckPermissions";
import { FaGraduationCap } from "react-icons/fa";

// Helper para capitalizar
const capitalizeTitle = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ") // Divide el texto en palabras
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
    .join(" "); // Une las palabras nuevamente con un espacio
};


export const Carreras = () => {
  const [selectedCareer, setSelectedCareer] = useState(null);

  const handleEditClick = (career) => {
    setSelectedCareer(career);
  };

  const { getDataCareer, careers } = useFetchCareer();
  useEffect(() => {
    getDataCareer();
  }, []);

  const idEditar = "editarCarrera";

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden mb-4">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">
            <FaGraduationCap className="me-2" />
            Gestión de Carreras
          </h3>
        </div>

        <div className="card-body">
          {careers.length > 0 ? (
            <div className="row g-4">
              {careers.map((career, index) => (
                <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                    <div className="card-header bg-primary bg-opacity-10 border-0 py-3">
                      <h5 className="card-title m-0 text-primary fw-semibold">
                        {capitalizeTitle(career.name)}
                      </h5>
                    </div>
                    <div className="card-body text-center d-flex flex-column align-items-center">
                      <div className="bg-white p-3 rounded-circle shadow-sm mb-3">
                        {career.logo ? (
                          <img
                            className="img-fluid"
                            src={career.logo}
                            alt={`Logo ${career.initials}`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "contain"
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentNode.innerHTML = `
        <div class='d-flex align-items-center justify-content-center text-muted' 
             style="width:80px;height:80px;font-size:12px">
          Sin logo
        </div>`;
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center text-muted"
                            style={{
                              width: "80px",
                              height: "80px",
                              fontSize: "12px"
                            }}
                          >
                            Sin logo
                          </div>
                        )}

                      </div>
                      <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">
                        Sigla: {career.initials}
                      </span>
                    </div>
                    <div className="card-footer bg-transparent border-0 d-flex justify-content-center gap-2 py-3">
                      <CheckPermissions requiredPermission="editar-unidades-academicas">
                        <ButtonEdit
                          idEditar={idEditar}
                          onEditClick={() => handleEditClick(career)}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center"
                        >
                        </ButtonEdit>
                      </CheckPermissions>
                      <CheckPermissions requiredPermission="ver-gestiones-asignadas-por-id">
                        <ButtonVerGestion
                          to={`/administracion/careers/${career.id}/assigns`}
                          className="btn btn-outline-success d-flex align-items-center"
                        >
                        </ButtonVerGestion>
                      </CheckPermissions>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center text-muted">
                <FaGraduationCap className="fs-1 mb-2" />
                No hay carreras registradas.
              </div>
            </div>
          )}
        </div>
      </div>

      <CheckPermissions requiredPermission="editar-unidades-academicas">
        <ModalEdit
          idEditar={idEditar}
          data={selectedCareer}
          title="Editar Carrera"
        />
      </CheckPermissions>
    </div>
  );
};
