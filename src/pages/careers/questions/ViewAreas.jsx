import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useFetchAreasByCareer } from '../../../hooks/fetchAreas';
import ButtonEdit from '../areas/ButtonEdit';
import { ModalEdit } from '../areas/ModalEdit';
import CheckPermissions from '../../../routes/CheckPermissions';
import { ButtonImport } from '../questions/imports/ButtonImport';
import { ModalImport } from '../questions/imports/ModalImport';
import { FaClipboardList } from 'react-icons/fa';
import { getApi, postApi } from '../../../services/axiosServices/ApiService';
import { customAlert } from '../../../utils/domHelper';
import styles from './AreaCards.module.css';

export const ViewAreas = () => {
  const [questionCounts, setQuestionCounts] = useState({});
  const [selectedArea, setSelectedArea] = useState(null);
  const [careerId, setCareerId] = useState(null);
  const { areas, getData } = useFetchAreasByCareer();

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

  const idEditar = "editarArea";

  const handleUnsubscribe = async (areaId) => {
    try {
      const formData = new FormData();
      formData.append('area_id', areaId);

      const response = await postApi(`areas/unsubscribe/${areaId}`, formData);
      if (response) {
        customAlert("Área actualizada exitosamente", "success");
        if (careerId) {
          await getData(careerId);
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
          {areas.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center text-muted">
                <FaClipboardList className="fs-1 mb-2" />
                No hay áreas académicas registradas.
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {areas.map((area) => (
                <div key={area.id} className="col-xl-3 col-lg-4 col-md-6">
                  <div className={`card h-100 border-0 shadow-sm ${styles.hoverShadow} ${styles.transition} ${area.status === "inactivo" ? "bg-danger bg-opacity-10" : ""}`}>
                    <div className="card-header bg-primary bg-opacity-10 border-0 py-3">
                      <h5 className="card-title m-0 text-primary fw-semibold text-center text-capitalize">
                        {area.name}
                      </h5>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="mb-3 text-center">
                        <div className="card-text text-muted" style={{ minHeight: "2.5em" }}>
                          {area.description ? (
                            <p>{area.description}</p>
                          ) : (
                            <p className="invisible">Sin descripción</p>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className={`badge px-3 py-2 ${area.status === "inactivo" ? "bg-danger" : "bg-success"}`}>
                            {area.status}
                          </span>
                        </div>
                        <div className="badge bg-primary mt-2">
                          {questionCounts[area.id] !== undefined
                            ? `${questionCounts[area.id]} preguntas`
                            : "Cargando..."}
                        </div>
                      </div>

                      <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                        <CheckPermissions requiredPermission="editar-areas">
                          <ButtonEdit
                            idEditar={idEditar}
                            onEditClick={() => handleEditClick(area)}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center"
                          />
                        </CheckPermissions>

                        <CheckPermissions requiredPermission="importar-preguntas">
                          <ButtonImport
                            modalIdImp={`importar-${area.id}`}
                            className="btn btn-sm btn-outline-success d-flex align-items-center"
                          />
                        </CheckPermissions>

                        <CheckPermissions requiredPermission="editar-areas">
                          <button
                            onClick={() => handleUnsubscribe(area.id)}
                            className={`btn btn-sm d-flex align-items-center ${area.status === "inactivo" ? "btn-outline-success" : "btn-outline-danger"
                              }`}
                          >
                            {area.status === "inactivo" ? "Activar" : "Desactivar"}
                          </button>
                        </CheckPermissions>
                      </div>
                      <Link
                        to={`${area.id}/imports`}
                        className="btn btn-sm btn-outline-primary mt-2"
                      >
                        Importar Preguntas
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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