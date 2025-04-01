/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { AssignCareer } from "../../components/forms/AssignCareer";
import { Card } from "../../components/login/Card";
import PropTypes from 'prop-types';

export const ModalAsign = ({ modalId, title, data }) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);

  useEffect(() => {
    // Escuchar el evento de apertura del modal y obtener el ID del usuario
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.addEventListener("show.bs.modal", (event) => {
        const button = event.relatedTarget;
        const personaId = button.getAttribute("data-persona-id");
        setSelectedPersonaId(personaId);
      });
      
      // Limpiar el ID al cerrar el modal
      modal.addEventListener("hidden.bs.modal", () => {
        setSelectedPersonaId(null);
      });
    }
    
    return () => {
      // Limpiar los event listeners
      if (modal) {
        modal.removeEventListener("show.bs.modal", () => {});
        modal.removeEventListener("hidden.bs.modal", () => {});
      }
    };
  }, [modalId]);

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      style={{ zIndex: "1100" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-center text-success" id="exampleModalLabel">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <Card className="card align-items-center h-auto gap-3 p-3">
            <AssignCareer data={data} personaId={selectedPersonaId} />
          </Card>
        </div>
      </div>
    </div>
  );
};

ModalAsign.propTypes = {
  modalId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object
};