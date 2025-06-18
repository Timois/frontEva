/* eslint-disable react/prop-types */

export const ModalViewStudents = ({ modalId, students = [], onClose }) => {
    return (
        <div
            className="modal fade show d-block"
            id={modalId}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-modal="true"
            role="dialog"
            data-bs-backdrop="static"
            style={{
                zIndex: "1100",
                backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Lista de Estudiantes</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {students.length > 0 ? (
                            <ul className="list-group">
                                {[...students]
                                    .sort((a, b) => {
                                        const nameA = (a.paternal_surname || a.maternal_surname || '').toLowerCase();
                                        const nameB = (b.paternal_surname || b.maternal_surname || '').toLowerCase();
                                        return nameA.localeCompare(nameB);
                                    })
                                    .map((student, index) => (
                                        <li key={index} className="list-group-item text-capitalize">
                                            {student.paternal_surname || ''} {student.maternal_surname || ''} {student.name}
                                        </li>
                                    ))}
                            </ul>

                        ) : (
                            <p className="text-muted">Este grupo no tiene estudiantes.</p>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

