/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { AreaContext } from '../../../context/AreaProvider';
import { useFetchAreasByCareer } from '../../../hooks/fetchAreas';
import ButtonEdit from './ButtonEdit';
import { ModalEdit } from './ModalEdit';
import { useParams } from 'react-router-dom';
import { ButtonImport } from './imports/ButtonImport';
import { ModalRegister } from './imports/ModalRegister';



export const Area = () => {
  const { career_id } = useParams();
  const { areas, setAreas } = useContext(AreaContext);
  const [selectedArea, setSelectedArea] = useState(null);
  const { getData } = useFetchAreasByCareer();

  const handleEditClick = (area) => {
    setSelectedArea(area);
  };
  const handleImportClick = (area) => {
    setSelectedArea(area);
  }
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
  const modalId = "registerImport";
  return (
    <div className="container">
      <div className="row">
        {areas.length > 0 ? (
          areas.map((area, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card border border-warning text-white bg-dark">
                <div className="card-body" style={{gap: "10px", alignItems: "center"}}>
                  <h5 className="card-title">{area.name}</h5>
                  <p className="card-text">{area.description}</p>
                  <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(area)} />
                  <ButtonImport modalIdImp={`import-${area.id}`} onClick={() => handleImportClick(area)} />
                  <ModalRegister 
                    modalIdImp={`import-${area.id}`} 
                    title={`Importar Preguntas para ${area.name}`} 
                    areaId={area.id} 
                  />
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
      <ModalEdit idEditar={idEditar} data={selectedArea} title="Editar Área"/>
    </div>
  );
};