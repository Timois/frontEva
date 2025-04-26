/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Card } from '../../../components/login/Card';
import { useContext, useEffect, useState } from 'react';
import { useFetchCareerAssignPeriod } from '../../../hooks/fetchCareers';
import { CareerAssignContext } from '../../../context/CareerAssignProvider';
import CancelButton from '../../../components/forms/components/CancelButon';

export const ModalViewManagementPeriod = ({ ModalId, title }) => {
    const [id, setId] = useState(null);
    const { getDataCareerAssignmentPeriods } = useFetchCareerAssignPeriod(id);
    const { careerAssignmentsPeriods } = useContext(CareerAssignContext);
    
    const handleClose = () => {
        const modalElement = document.getElementById(ModalId);
        const bsModal = bootstrap.Modal.getInstance(modalElement);
        if (bsModal) {
            bsModal.hide();
        }
    };
    useEffect(() => {
        //wait until the modal gets rendered
        const interval = setInterval(() => {
            const modalElement = document.getElementById(ModalId);
            if (modalElement) {
                const idAttr = modalElement.getAttribute("data-academic_management_career_id");
                if (idAttr) {
                    setId(idAttr);
                    clearInterval(interval);
                }
            }
        }, 100);
    }, [setId, ModalId]);

    useEffect(() => {
        if (!id) return;
        getDataCareerAssignmentPeriods();
    }, [id])

    const setModalData = (id, modalId) => {
        const modal = document.getElementById(modalId);
        //add an attribute to the modal to know which career is being assigned
        modal.setAttribute("data-academic_management_career_id", id);
    };
    return (
        <div
            className="modal fade"
            id={ModalId}
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
                    </div>
                    <Card className={"card align-items-center h-auto gap-3 p-3"}>
                        {careerAssignmentsPeriods && careerAssignmentsPeriods.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Periodo</th>
                                        <th scope="col">Fecha de inicio</th>
                                        <th scope="col">Fecha de fin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {careerAssignmentsPeriods.map((period) => (
                                        <tr key={period.id}>
                                            <td>{period.period}</td>
                                            <td>{period.initial_date}</td>
                                            <td>{period.end_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center mt-3 alert alert-warning">
                                <p className="text-muted">No hay periodos asignados. ¿Desea asignar un periodo?</p>
                                <button
                                    className="btn btn-primary me-2"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#asignarPeriodo`}
                                    onClick={() => setModalData(null, "asignarPeriodo")}
                                >
                                    Asignar Periodo
                                </button>
                            </div>
                        )}
                        <div className="modal-footer w-100">
                            <CancelButton
                                data-bs-dismiss="modal"
                                className="btn btn-secondary"
                                label="Cerrar"
                            />
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    )
}

ModalViewManagementPeriod.propTypes = {
    ModalId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};