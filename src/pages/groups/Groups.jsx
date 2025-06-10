import { useEffect, useState } from "react"
import { fetchGroupByEvaluation } from "../../hooks/fetchGroup"
import { useParams } from "react-router-dom"
import { FaObjectGroup } from "react-icons/fa"
import ButtonEdit from "./ButtonEdit"
import ModalEdit from "./ModalEdit"
import { ModalViewStudents } from "./ModalViewStudents"
export const Groups = () => {
    const { id } = useParams();
    const evaluationId = id;
    const [selectedGroup, setSelectedGroup] = useState(null);
    const handleEditClick = (group) => setSelectedGroup(group);
    const { groups, getDataGroupEvaluation } = fetchGroupByEvaluation();
    const [selectedGroupStudents, setSelectedGroupStudents] = useState([]);
    const [showStudentsModal, setShowStudentsModal] = useState(false);

    useEffect(() => {
        getDataGroupEvaluation(evaluationId);
    }, [evaluationId]);
    
    const handleViewStudents = (group) => {
        setSelectedGroupStudents(group.students);
        setShowStudentsModal(true);
    };

    const idEditar = "editGroup";

    const examDate = groups.length > 0 ? groups[0].start_time.split(" ")[0] : null;

    return (
        <div className="container-fluid p-4">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top">
                    <h3 className="mb-0">
                        <FaObjectGroup className="me-2" />
                        Gestión de Grupos
                    </h3>
                    {examDate && (
                        <p className="mt-2 mb-0 text-white fw-semibold">
                            Fecha del examen: {examDate}
                        </p>
                    )}
                </div>

                <div className="table-responsive rounded-3">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th scope="col" width="10%" className="text-center fw-medium text-primary">N°</th>
                                <th scope="col" className="fw-medium text-primary">Nombre</th>
                                <th scope="col" className="fw-medium text-primary">Descripcion</th>
                                <th scope="col" className="fw-medium text-primary">Horario</th>
                                <th scope="col" className="fw-medium text-primary">Estudiantes</th>
                                <th scope="col" className="fw-medium text-primary">Capacidad</th>
                                <th scope="col" width="20%" className="text-center fw-medium text-primary">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.length > 0 ? (
                                groups.map((group, index) => {
                                    const startTime = group.start_time.split(" ")[1].slice(0, 5);
                                    const endTime = group.end_time.split(" ")[1].slice(0, 5);
                                    return (
                                        <tr key={index} className="transition-all">
                                            <td className="text-center text-muted">{index + 1}</td>
                                            <td className="fw-semibold text-capitalize">{group.name}</td>
                                            <td className="fw-semibold">{group.description}</td>
                                            <td className="fw-semibold">{startTime} - {endTime}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm btn-outline-info"
                                                    onClick={() => handleViewStudents(group)}
                                                >
                                                    Ver estudiantes ({group.students.length})
                                                </button>
                                            </td>
                                            <td className="text-center">{group.students.length}  {group.capacity}</td>
                                            <td className="text-center">
                                                <ButtonEdit
                                                    idEditar={idEditar}
                                                    onEditClick={() => handleEditClick(group)}
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                                                >
                                                </ButtonEdit>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center text-muted">
                                            <FaObjectGroup className="fs-1 mb-2" />
                                            No hay grupos registrados.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalEdit
                idEditar={idEditar}
                data={selectedGroup}
                title="Editar Periodo"
            />

            {showStudentsModal && (
                <ModalViewStudents
                    modalId="modalViewStudents"
                    students={selectedGroupStudents}
                    onClose={() => setShowStudentsModal(false)}
                />
            )}
        </div>
    );
};

