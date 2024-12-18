/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { CareerContext } from "../../context/CareerProvider";
import ButtonEdit from "./ButtonEdit";
import { ModalEdit } from "./ModalEdit";
import { useFetchCareer } from "../../hooks/fetchCareers";
import { ButtonVerGestion } from "./ButtonVerGestion";

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
  const { careers, setCareers } = useContext(CareerContext);
  const [selectedCareer, setSelectedCareer] = useState(null);

  const handleEditClick = (career) => {
    setSelectedCareer(career);
  };

  const { getDataCareer } = useFetchCareer();
  useEffect(() => {
    getDataCareer();
  }, []);

  const idEditar = "editarCarrera";

  return (
    <div className="container mt-4">
      <div className="row">
        {careers.length > 0 ? (
          careers.map((career, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100 border-warning">
                <div className="card-header bg-success text-white">
                  <h5 className="card-title m-0">{capitalizeTitle(career.name)}</h5>
                </div>
                <div className="card-body text-center">
                  <img
                    className="card-img-top p-2"
                    src={career.logo}
                    alt="logo"
                    style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
                  />
                  <p className="card-text mt-3">
                    <strong>Sigla:</strong> {career.initials}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-around align-items-center p-2">
                  <ButtonEdit
                    idEditar={idEditar}
                    onEditClick={() => handleEditClick(career)}
                  />
                  <ButtonVerGestion to={`/career/${career.id}/assigns`} />
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-warning text-center">
              No hay carreras registradas.
            </div>
          </div>
        )}
      </div>
      <ModalEdit idEditar={idEditar} data={selectedCareer} />
    </div>
  );
};
