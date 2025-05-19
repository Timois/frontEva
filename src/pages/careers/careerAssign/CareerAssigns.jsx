
import PropTypes from "prop-types";
import { useFetchGestion } from "../../../hooks/fetchGestion";
import { useContext, useEffect, useState } from "react";
import { GestionContext } from "../../../context/GestionProvider";
import { ViewPeriod } from "../periodsAsign/ViewPeriod";
import { ModalViewManagementPeriod } from "../periodsAsign/ModalViewManagementPeriod";
import { AssignManagement } from "../AssignManagement"
import { ModalRegisterManagement } from "../ModalRegisterManagement";
import CheckPermissions from "../../../routes/CheckPermissions";
import { useCountdown } from '../../../hooks/useCountdown';

const capitalizeTitle = (text) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const CareerAssigns = ({ data }) => {
    const { getData } = useFetchGestion();
    const { gestions } = useContext(GestionContext);
    const [transformedGestions, setTransformedGestions] = useState([]);
    const countdowns = useCountdown(data);
    const modalIdManagement = "asignarGestion";

    useEffect(() => {
        if (gestions.length === 0) {
            getData();
            return;
        }
        const transformed = gestions.map((gestion) => gestion.year || "Sin información");
        setTransformedGestions(transformed);
    }, [gestions]);

    if (data.length === 0) {
        return (
            <div className="container-fluid p-4">
                <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                    <div className="card-header bg-primary text-white py-3 rounded-top">
                        <h3 className="mb-0">
                            <i className="fas fa-link me-2"></i>
                            Asignación de Gestiones
                        </h3>
                    </div>
                    <div className="card-body text-center py-5">
                        <div className="d-flex flex-column align-items-center text-muted">
                            <i className="fas fa-calendar-plus fs-1 mb-3"></i>
                            <h4>No hay gestiones asignadas</h4>
                            <p className="mb-4">¿Desea asignar una gestión?</p>
                            <CheckPermissions requiredPermission="asignar-gestiones">
                                <div className="text-center mt-3">
                                    <AssignManagement />
                                    <ModalRegisterManagement id={modalIdManagement} title="Asignar Gestion" />
                                </div>
                            </CheckPermissions>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const careerName = capitalizeTitle(data[0].name);

    const setModalData = (id, modalId) => {
        const modal = document.getElementById(modalId);
        modal.setAttribute("data-academic_management_career_id", id);
    };

    return (
        <div className="container-fluid p-4">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top">
                    <h3 className="mb-0">
                        <i className="fas fa-link me-2"></i>
                        {careerName} - Gestión Académica
                    </h3>
                </div>

                <div className="card-body">
                    <div className="accordion accordion-flush" id="gestionAccordion">
                        {data.map((gestion, index) => (
                            <div className="accordion-item border-bottom mb-3 shadow-sm rounded" key={index}>
                                <h2 className="accordion-header" id={`heading-${index}`}>
                                    <button
                                        className="accordion-button collapsed py-3"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${index}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse-${index}`}
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            color: '#212529'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                                            <span className="fw-semibold">
                                                <i className="fas fa-calendar-alt me-2 text-primary"></i>
                                                Gestión {transformedGestions[index] || "Sin información"}
                                            </span>
                                            <span 
                                                className={`badge ${countdowns[index] === "Tiempo agotado" 
                                                    ? "bg-danger" 
                                                    : "bg-primary"} bg-opacity-10 text-${countdowns[index] === "Tiempo agotado" 
                                                    ? "danger" 
                                                    : "primary"} py-2 px-3`}
                                            >
                                                <i className="fas fa-clock me-1"></i>
                                                {countdowns[index] || "Calculando..."}
                                            </span>
                                        </div>
                                    </button>
                                </h2>
                                <div
                                    id={`collapse-${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading-${index}`}
                                    data-bs-parent="#gestionAccordion"
                                >
                                    <div className="accordion-body pt-3">
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <p>
                                                    <i className="fas fa-calendar-check me-2 text-primary"></i>
                                                    <strong>Fecha de Inicio:</strong> {gestion.initial_date}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <p>
                                                    <i className="fas fa-calendar-times me-2 text-primary"></i>
                                                    <strong>Fecha de Fin:</strong> {gestion.end_date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 justify-content-center mt-3">
                                            <CheckPermissions requiredPermission="asignar-periodos">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#asignarPeriodo`}
                                                    onClick={() => setModalData(gestion['academic_management_career_id'], "asignarPeriodo")}
                                                >
                                                    <i className="fas fa-plus-circle me-1"></i>
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
                            </div>
                        ))}
                    </div>
                </div>
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
