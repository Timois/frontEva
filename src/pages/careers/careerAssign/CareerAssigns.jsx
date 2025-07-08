
import PropTypes from "prop-types";
import { ViewPeriod } from "../periodsAsign/ViewPeriod";
import { ModalViewManagementPeriod } from "../periodsAsign/ModalViewManagementPeriod";
import { AssignManagement } from "../AssignManagement"
import { ModalRegisterManagement } from "../ModalRegisterManagement";
import CheckPermissions from "../../../routes/CheckPermissions";
import { useCountdown } from '../../../hooks/useCountdown';
import { useMemo } from "react";

export const CareerAssigns = ({ data }) => {
 
    const endDates = useMemo(() => {
        return data.map(gestion => ({ end_date: gestion.end_date }));
    }, [data]);
    const countdowns = useCountdown(endDates);
    const modalIdManagement = "asignarGestion"
    if (data.length === 0) {
        return (
            <div className="col-12">
                <div className="alert alert-warning text-center">
                    No hay gestiones asignadas. ¿Desea asignar una gestion?<br />
                </div>
                <CheckPermissions requiredPermission="asignar-gestiones">
                    <div className="text-center mt-3">
                        <AssignManagement />
                        <ModalRegisterManagement id={modalIdManagement} title="Asignar Gestion" />
                    </div>
                </CheckPermissions>
            </div>
        );
    }

    const setModalData = (id, modalId) => {
        const modal = document.getElementById(modalId);
        //add an attribute to the modal to know which career is being assigned
        modal.setAttribute("data-academic_management_career_id", id);
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4 text-capitalize">{data[0]?.name}</h2>
            <div className="accordion" id="accordionExample">
                {data.map((gestion, index) => (
                    <div className="accordion-item" style={{ backgroundColor: "#fefefe" }} key={index}>
                        <h2 className="accordion-header" id={`heading-${index}`}>
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${index}`}
                                aria-expanded="true"
                                aria-controls={`collapse-${index}`}
                                style={{
                                    backgroundColor: "#343a40",
                                    color: "white",
                                }}
                            >
                                Gestión {gestion.year || "Sin información"}
                                <div
                                    className="alert"
                                    style={{
                                        color: "#041919", padding: "10px", fontWeight: "bold",
                                        fontSize: "1.2rem", marginTop: "10px", borderRadius: "5px",
                                        width: "100%", textAlign: "center",
                                    }}
                                >
                                    <>
                                        <strong>Tiempo Restante: </strong>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "1.5rem",
                                                color: countdowns[index] === "Tiempo agotado" ? "red" : "blue",
                                            }}
                                        >
                                            {countdowns[index] || "Calculando..."}
                                        </span>
                                    </>
                                </div>
                            </button>

                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent="#accordionExample"
                        >
                            <div className="accordion-body">
                                <p>
                                    <strong>Fecha de Inicio:</strong> {gestion.initial_date}
                                </p>
                                <p>
                                    <strong>Fecha de Fin:</strong> {gestion.end_date}
                                </p>

                            </div>
                            <div className="d-flex gap-1 justify-content-center mt-3">
                                <CheckPermissions requiredPermission="asignar-periodos">
                                    <button
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#asignarPeriodo`}
                                        onClick={() => setModalData(gestion['academic_management_career_id'], "asignarPeriodo")}
                                    >
                                        Asignar Periodo
                                    </button>
                                </CheckPermissions>
                                <CheckPermissions requiredPermission="ver-periodos-asignados">
                                    <ViewPeriod handleClick={() => {
                                        setModalData(gestion['academic_management_career_id'], "verPeriodo");
                                    }} />
                                </CheckPermissions>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <CheckPermissions requiredPermission="ver-periodos-asignados">
                <ModalViewManagementPeriod ModalId="verPeriodo" title="Periodos" />
            </CheckPermissions>
        </div>
    );
};

CareerAssigns.propTypes = {
    data: PropTypes.array.isRequired,
};
