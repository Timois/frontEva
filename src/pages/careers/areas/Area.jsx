import { useContext, useEffect, useState } from 'react';
import { AreaContext } from '../../../context/AreaProvider';
import { useFetchAreasByCareer } from '../../../hooks/fetchAreas';
import ButtonEdit from './ButtonEdit';
import { ModalEdit } from './ModalEdit';

export const Area = () => {
  const { areas } = useContext(AreaContext);
  const [selectedArea, setSelectedArea] = useState(null);
  // Obtener y validar el career_id desde localStorage
  const { getData } = useFetchAreasByCareer();
  const handleEditClick = (area) => {
    setSelectedArea(area);
  };
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const careerIdFromStorage = user ? user.carrera : null
    const careerId = Number(careerIdFromStorage); // Asegurar que sea número
    getData(careerId);
  }, []);

  const idEditar = "editarArea";

  return (
    <div className="container">
      <div className="row">
        {areas.length > 0 ? (
          areas.map((area, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card border border-warning text-white bg-dark">
                <div className="card-body" style={{ gap: "10px", alignItems: "center" }}>
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
      <ModalEdit idEditar={idEditar} data={selectedArea} title="Editar Área" />
    </div>
  );
};
