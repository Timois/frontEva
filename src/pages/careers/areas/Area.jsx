import { useContext, useEffect, useState } from 'react';
import { AreaContext } from '../../../context/AreaProvider';
import { useFetchAreasByCareer } from '../../../hooks/fetchAreas';
import ButtonEdit from './ButtonEdit';
import { ModalEdit } from './ModalEdit';
import CheckPermissions from '../../../routes/CheckPermissions';
import { ButtonImport } from '../questions/imports/ButtonImport';
import { ModalImport } from '../questions/imports/ModalImport';
import { FaClipboardList } from 'react-icons/fa';
import { postApi } from '../../../services/axiosServices/ApiService';
import { customAlert } from '../../../utils/domHelper';

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

  const handleUnsubscribe = async (areaId) => {
    try {
      const formData = new FormData();
      formData.append('area_id', areaId);
      
      const response = await postApi(`areas/unsubscribe/${areaId}`, formData);
      if (response.status === 200) {
        customAlert("Área dada de baja exitosamente", "success");
        getData(careerId); // Recargar las áreas
      }
    } catch (error) {
      console.error("Error al dar de baja el área:", error);
      customAlert("Error al dar de baja el área", "error");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden mb-4">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">
            <FaClipboardList className="me-2" />
            Áreas Académicas
          </h3>
        </div>

        <div className="card-body">
          {areas.length > 0 ? (
            <div className="row g-4">
              {areas.map((area, index) => (
                <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                    <div className="card-header bg-primary bg-opacity-10 border-0 py-3">
                      <h5 className="card-title m-0 text-primary fw-semibold text-center">
                        {area.name}
                      </h5>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <p className="card-text text-muted flex-grow-1">
                        {area.description || <span className="text-muted">Sin descripción</span>}
                      </p>
                      <div className="d-flex justify-content-center gap-2 mt-3">
                        <CheckPermissions requiredPermission="editar-areas">
                          <ButtonEdit
                            idEditar={idEditar}
                            onEditClick={() => handleEditClick(area)}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center"
                          >
                          </ButtonEdit>
                        </CheckPermissions>
                        <CheckPermissions requiredPermission="importar-preguntas">
                          <ButtonImport
                            modalIdImp={`importar-${area.id}`}
                            className="btn btn-sm btn-outline-success d-flex align-items-center"
                          >
                          </ButtonImport>
                        </CheckPermissions>
                        <CheckPermissions requiredPermission="editar-areas">
                          <button
                            onClick={() => {
                              if (window.confirm('¿Está seguro de dar de baja esta área?')) {
                                handleUnsubscribe(area.id);
                              }
                            }}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center"
                          >
                            Dar de baja
                          </button>
                        </CheckPermissions>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center text-muted">
                <FaClipboardList className="fs-1 mb-2" />
                No hay áreas académicas registradas.
              </div>
            </div>
          )}
        </div>
      </div>

      <CheckPermissions requiredPermission="editar-areas">
        <ModalEdit
          idEditar={idEditar}
          data={selectedArea}
          title="Editar Área Académica"
        />
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
