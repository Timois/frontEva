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
import { HiThumbDown, HiThumbUp } from 'react-icons/hi';

export const Area = () => {
  const { areas } = useContext(AreaContext);
  const [selectedArea, setSelectedArea] = useState(null);
  const [careerId, setCareerId] = useState(null);

  const { getData } = useFetchAreasByCareer();

  const handleEditClick = (area) => {
    setSelectedArea(area);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const careerIdFromStorage = user ? user.career_id : null;
    const careerIdNumber = Number(careerIdFromStorage);
    setCareerId(careerIdNumber);
  }, []);

  useEffect(() => {
    if (careerId) {
      getData(careerId);
    }
  }, [careerId]);

  const idEditar = "editarArea";

  const handleUnsubscribe = async (areaId) => {
    try {
      const formData = new FormData();
      formData.append('area_id', areaId);

      const response = await postApi(`areas/unsubscribe/${areaId}`, formData);
      if (response) {
        customAlert("Área actualizada exitosamente", "success");
        if (careerId) {
          await getData(careerId); // esto actualiza el estado en el contexto
        }
      } else {
        customAlert("Error al actualizar el estado del área", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      customAlert("Error al cambiar el estado del área", "error");
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
                  <div className={`card h-100 border-0 shadow-sm hover-shadow transition-all ${area.status === "inactivo" ? "bg-danger bg-opacity-10" : ""
                    }`}>
                    <div className="card-header bg-primary bg-opacity-10 border-0 py-3">
                      <h5 className="card-title m-0 text-primary fw-semibold text-center text-capitalize">
                        {area.name}
                      </h5>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="mb-3 text-center">
                        <div
                          className="card-text text-muted"
                          style={{
                            minHeight: "2.5em", // ajusta según la altura esperada de las descripciones
                          }}
                        >
                          {area.description ? (
                            <p>{area.description}</p>
                          ) : (
                            <p className="invisible">Sin descripción</p>
                          )}
                        </div>
                        <div className="mt-2">
                          <span
                            className={`badge px-3 py-2 ${area.status === "inactivo" ? "bg-danger" : "bg-success"
                              }`}
                          >
                            {area.status}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center gap-2 mt-3">
                        <CheckPermissions requiredPermission="editar-areas">
                          <ButtonEdit
                            idEditar={idEditar}
                            onEditClick={() => handleEditClick(area)}
                            className={`btn btn-sm btn-outline-primary d-flex align-items-center ${area.status === "inactivo" ? "opacity-75" : ""
                              }`}
                          />
                        </CheckPermissions>

                        <CheckPermissions requiredPermission="importar-preguntas">
                          <ButtonImport
                            modalIdImp={`importar-${area.id}`}
                            className={`btn btn-sm btn-outline-success d-flex align-items-center ${area.status === "inactivo" ? "opacity-75" : ""
                              }`}
                          />
                        </CheckPermissions>

                        <CheckPermissions requiredPermission="editar-areas">
                          <button
                            onClick={() => handleUnsubscribe(area.id)}
                            className={`btn btn-sm d-flex align-items-center ${area.status === "inactivo"
                              ? "btn-outline-danger"
                              : "btn-outline-success"
                              }`}
                          >
                            {area.status === "inactivo" ? <HiThumbDown /> : <HiThumbUp />}
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
