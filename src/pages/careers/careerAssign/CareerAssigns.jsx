
import PropTypes from "prop-types";
import { useFetchGestion } from "../../../hooks/fetchGestion";
import { useContext, useEffect, useState } from "react";
import { GestionContext } from "../../../context/GestionProvider";
import { ViewPeriod } from "../periodsAsign/ViewPeriod";
import { ModalViewManagementPeriod } from "../periodsAsign/ModalViewManagementPeriod";
import { AssignManagement } from "../AssignManagement"
import { ModalRegisterManagement } from "../ModalRegisterManagement";
import { ButtonVerAreas } from "./ButtonVerAreas";

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
    const [countdowns, setCountdowns] = useState([]);

    useEffect(() => {
        if (gestions.length === 0) {
            getData();
            return;
        }
        // Mapeo para transformar los datos
        const transformed = gestions.map((gestion) => gestion.year || "Sin información");
        setTransformedGestions(transformed);
    }, [gestions]);


    useEffect(() => {
        const intervalId = setInterval(() => {
            const updatedCountdowns = data.map((gestion, index) => {
                const endDate = new Date(gestion.end_date);

                endDate.setHours(23, 59, 59, 999);

                const currentDate = new Date();
                const timeRemaining = endDate - currentDate;

                if (timeRemaining <= 0) {
                    return { index, countdown: "Tiempo agotado" };
                } else {
                    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                    return {
                        index,
                        countdown: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                    };
                }
            });

            setCountdowns((prev) => {
                const updated = [...prev];
                updatedCountdowns.forEach(({ index, countdown }) => {
                    updated[index] = countdown;
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [data]);

    const modalIdManagement = "asignarGestion"
    if (data.length === 0) {
        return (
            <div className="col-12">
                <div className="alert alert-warning text-center">
                    No hay gestiones asignadas. ¿Desea asignar una gestion?<br />
                </div>
                <div className="text-center mt-3">
                    <AssignManagement />
                    <ModalRegisterManagement id={modalIdManagement} title="Asignar Gestion" />
                </div>
            </div>
        );
    }

    const careerName = capitalizeTitle(data[0].name);

    const setModalData = (id, modalId) => {
        const modal = document.getElementById(modalId);
        //add an attribute to the modal to know which career is being assigned
        modal.setAttribute("data-academic_management_career_id", id);
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">{careerName}</h2>
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
                                Gestión {transformedGestions[index] || "Sin información"}
                                <div
                                    className="alert"
                                    style={{
                                        color: "#fff", padding: "10px", fontWeight: "bold",
                                        fontSize: "1.2rem", marginTop: "10px", borderRadius: "5px",
                                        width: "100%", textAlign: "center",
                                    }}
                                >
                                    <div>
                                        <strong>Tiempo Restante:</strong>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "1.5rem",
                                                color: countdowns[index] === "Tiempo agotado" ? "red" : "white",
                                            }}
                                        >
                                            {countdowns[index] || "Calculando..."}
                                        </span>
                                    </div>
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
                                <button
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#asignarPeriodo`}
                                    onClick={() => setModalData(gestion['academic_management_career_id'], "asignarPeriodo")}
                                >
                                    Asignar Periodo
                                </button>
                                <ViewPeriod handleClick={() => {
                                    setModalData(gestion['academic_management_career_id'], "verPeriodo");
                                    // console.log(gestion);
                                }} />
                                <ButtonVerAreas to={`/career/${gestion['academic_management_career_id']}/areas`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ModalViewManagementPeriod ModalId="verPeriodo" title="Periodos" />
        </div>
    );
};

CareerAssigns.propTypes = {
    data: PropTypes.array.isRequired,
};
