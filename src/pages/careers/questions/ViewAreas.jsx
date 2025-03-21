import { useContext, useState, useEffect } from "react";
import { AreaContext } from "../../../context/AreaProvider";
import { Question } from "./Question";
import ButtonAdd from "./ButtonAdd";
import { ButtonImport } from "../areas/imports/ButtonImport";
import { ModalRegister } from "./ModalRegister";
import { ModalImport } from "../areas/imports/ModalImport";

export const ViewAreas = () => {
  const { areas } = useContext(AreaContext);
  
  const [expandedArea, setExpandedArea] = useState(null);
  
  // Recuperar el área expandida del localStorage al cargar el componente
  useEffect(() => {
    const savedExpandedArea = localStorage.getItem('expandedArea');
    if (savedExpandedArea) {
      setExpandedArea(savedExpandedArea);
    }
  }, []);
  
  const toggleArea = (areaId) => {
    if (expandedArea === areaId) {
      setExpandedArea(null);
      localStorage.removeItem('expandedArea'); // Eliminar del localStorage
    } else {
      setExpandedArea(areaId);
      localStorage.setItem('expandedArea', areaId); // Guardar en localStorage
    }
  };
  
  const modalId = "registroPregunta";
  const modalIdImp = "registerImport";
  
  return (
    <div className="container-fluid p-0">
      <div className="w-100">
        {expandedArea === null ? (
          // Vista de todas las áreas (ninguna expandida)
          <div className="row g-0 w-100 m-0">
            {areas?.map((area) => (
              <div key={area.id} className="col-12 col-sm-6 col-md-4 col-lg-3 p-2">
                <div className="card h-100">
                  <div className="card-header">
                    <h2 className="mb-0">
                      <button 
                        className="btn btn-link btn-block text-left w-100 text-decoration-none" 
                        type="button" 
                        onClick={() => toggleArea(area.id)}
                      >
                        {area.name}
                      </button>
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vista de un área expandida
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center p-2 bg-light">
              <h2 className="mb-0">
                {areas?.find(area => area.id === expandedArea)?.name || "Área"}
              </h2>
              <ButtonAdd modalId={modalId} />
              <ButtonImport modalIdImp={modalIdImp} />
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => toggleArea(null)}
              >
                Volver a todas las áreas
              </button>
            </div>
            <div className="p-3"> 
              <Question areaId={expandedArea} />
            </div>
          </div>
        )}
      </div>
      <ModalRegister ModalId={modalId} title="Registrar pregunta" />
      <ModalImport modalIdImp={modalIdImp} title="Importar preguntas" areaId={expandedArea} />
    </div>
  );
};