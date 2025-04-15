import { useContext, useEffect, useState } from 'react';
import { AreaContext } from '../../../context/AreaProvider';
import { useFetchAreasByCareer } from '../../../hooks/fetchAreas';
import ButtonEdit from './ButtonEdit';
import { ModalEdit } from './ModalEdit';
import CheckPermissions from '../../../routes/CheckPermissions';
import { ButtonImport } from '../questions/imports/ButtonImport';
import { ModalImport } from '../questions/imports/ModalImport';

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
    const careerIdFromStorage = user ? user.career_id : null
    const careerId = Number(careerIdFromStorage); // Asegurar que sea número
    getData(careerId);
  }, []);

  const idEditar = "editarArea";

  return (
    <div className="container">
      <h2 className="text-center text-white mb-4">Áreas Académicas</h2>
      <div className="row">
        {areas.length > 0 ? (
          areas.map((area, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card border border-warning text-white bg-dark h-100">
                <div className="card-header bg-warning bg-opacity-75 text-dark">
                  <h5 className="card-title mb-0 fw-bold text-center">{area.name}</h5>
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <p className="card-text text-white-50 fs-6 mb-3">{area.description}</p>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <CheckPermissions requiredPermission="editar-areas">
                      <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(area)} />
                    </CheckPermissions>
                    <CheckPermissions requiredPermission="importar-preguntas">
                      <ButtonImport 
                        modalIdImp={`importar-${area.id}`} 
                        onClick={() => {}} 
                      />
                    </CheckPermissions>
                  </div>
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
      <CheckPermissions requiredPermission="editar-areas">
        <ModalEdit idEditar={idEditar} data={selectedArea} title="Editar Área" />
      </CheckPermissions>
      {areas.map(area => (
        <CheckPermissions key={area.id} requiredPermission="importar-preguntas">
          <ModalImport 
            modalIdImp={`importar-${area.id}`}
            title={`Importar Preguntas - ${area.name}`}
            areaId={area.id}
          />
        </CheckPermissions>
      ))}
    </div>
  );
};
