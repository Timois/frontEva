/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { AreaContext } from '../../../context/AreaProvider';
import { useFetchAreasByCareer } from '../../../hooks/fetchAreas';
import ButtonEdit from './ButtonEdit';
import { ModalEdit } from './ModalEdit';
import { useParams } from 'react-router-dom';

export const Area = () => {
  const { career_id } = useParams();
  const { areas, setAreas } = useContext(AreaContext);
  const [selectedArea, setSelectedArea] = useState(null);
  const { getData } = useFetchAreasByCareer();

  const handleEditClick = (area) => {
    setSelectedArea(area);
  };

  useEffect(() => {
    if (!career_id) return;

    const fetchData = async () => {
      const data = await getData(career_id);
      console.log(data);
      setAreas(data);
    };

    fetchData();
  }, [career_id]);

  const idEditar = "editarArea";

  return (
    <div className="container">
      <div className="row">
        {areas.length > 0 ? (
          areas.map((area, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card border border-warning text-white bg-dark">
                <div className="card-body">
                  <h5 className="card-title">{area.name}</h5>
                  <p className="card-text">{area.description}</p>
                  <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(area)} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-white">
            <p>No hay Áreas registradas.</p>
          </div>
        )}
      </div>
      <ModalEdit />
    </div>
  );
};