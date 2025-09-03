/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import { fetchGroupByEvaluation } from "../../hooks/fetchGroup";
import { useNavigate, useParams } from "react-router-dom";
import { FaObjectGroup } from "react-icons/fa";
import ButtonEdit from "./ButtonEdit";
import ModalEdit from "./ModalEdit";
import { ModalViewStudents } from "./ModalViewStudents";
import { useExamns } from "../../hooks/fetchExamns";
import { getApi, updateApi } from "../../services/axiosServices/ApiService";
import { customAlert } from "../../utils/domHelper";
import { io } from "socket.io-client";
const urlWebSocket = import.meta.env.VITE_URL_WEBSOCKET;
export const Groups = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const evaluationId = id;
    const { examn, getExamnById } = useExamns()
    const [selectedGroup, setSelectedGroup] = useState(null);
    const { groups, totalStudents, getDataGroupEvaluation } = fetchGroupByEvaluation();
    const [selectedGroupStudents, setSelectedGroupStudents] = useState([]);
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // ✔️ Manejo seguro de assignedStudents
    const assignedStudents = useMemo(() => {
        if (!Array.isArray(groups) || groups.length === 0) return 0;

        return groups.reduce((acc, group) => {
            if (group && Array.isArray(group.students)) {
                return acc + group.students.length;
            }
            return acc;
        }, 0);
    }, [groups]);

    // ✔️ Manejo seguro de totalStudents
    const unassignedStudents = typeof totalStudents === "number"
        ? totalStudents - assignedStudents
        : 0;
    const handleEditClick = (data) => {
        setSelectedGroup(data);
        setShowEditModal(true);
    };

    useEffect(() => {
        getDataGroupEvaluation(evaluationId);
    }, [evaluationId]);

    useEffect(() => {
        getExamnById(evaluationId);
    }, [evaluationId]);

    const handleViewStudents = (group) => {
        setSelectedGroupStudents(group.students || []);
        setShowStudentsModal(true);
    };
    const tokenCache = new Map(); // key: token, value: { valid, role, expires }

    const verifyApi = async (token) => {
        const cached = tokenCache.get(token);
        if (cached && cached.expires > Date.now()) {
            return cached;
        }

        try {
            // Primero intento como docente
            const data = await getApi("users/verifyTeacherToken", token);
            const result = { ...data, role: "teacher" };
            tokenCache.set(token, { ...result, expires: Date.now() + 60000 }); // cache 1 min
            return result;
        } catch (err) {
            try {
                // Si falla, intento como estudiante
                const data = await getApi("students/verifyStudentToken", token);
                const result = { ...data, role: "student" };
                tokenCache.set(token, { ...result, expires: Date.now() + 60000 }); // cache 1 min
                return result;
            } catch (err2) {
                const result = { valid: false, role: null };
                tokenCache.set(token, { ...result, expires: Date.now() + 10000 }); // cache corto
                return result;
            }
        }
    };

    const handleStartGroup = async (group) => {
        try {
            const token = localStorage.getItem("jwt_token");
            if (!token) {
                customAlert("No tienes sesión iniciada", "error");
                return;
            }
            const data = await verifyApi(token);
            if (!data.valid) {
                customAlert("Token inválido o sesión expirada", "error");
                return;
            }
            // 🔹 Obtener duración desde Laravel
            const groupData = await updateApi(`groups/startGroup/${group.id}`);

            // 🔹 Enviar al servidor socket todo: roomId + token + duración
            const socketResponse = await fetch("http://127.0.0.1:3000/emit/start-evaluation", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: group.id.toString(),
                    token,
                    duration: groupData.duration // en segundos
                })
            });

            const socketResult = await socketResponse.json();
            if (!socketResponse.ok) {
                throw new Error(socketResult.message || 'Error al iniciar el examen en tiempo real');
            }

            customAlert("Grupo iniciado correctamente", "success");
            await getDataGroupEvaluation(evaluationId);

        } catch (error) {
            console.error("❌ Error iniciando grupo:", error);
            customAlert(error.response?.data?.message || "No se pudo iniciar el grupo", "error");
        }
    };

    const handlePauseGroup = async (group) => {
        try {
            await updateApi(`groups/pauseGroup/${group.id}`);
            customAlert("Grupo pausado correctamente", "success");
            await getDataGroupEvaluation(evaluationId); // Refresca los datos
        } catch (error) {
            customAlert("No se pudo pausar el grupo", "error");
        }
    }

    const handleResumeGroup = async (group) => {
        try {
            await updateApi(`groups/resumeGroup/${group.id}`);
            customAlert("Grupo resumido correctamente", "success");
            await getDataGroupEvaluation(evaluationId); // Refresca los datos
        } catch (error) {
            customAlert("No se pudo resumir el grupo", "error");
        }
    }

    const handleStopGroup = async (group) => {
        try {
            await updateApi(`groups/stopGroup/${group.id}`);
            customAlert("Grupo detenido correctamente", "success");
            await getDataGroupEvaluation(evaluationId); // Refresca los datos
        } catch (error) {
            customAlert("No se pudo detener el grupo", "error");
        }
    }
    const idEditar = "editGroup";

    const examDate = examn?.date_of_realization;

    return (
        <div className="container-fluid p-4">
            <button
                className="btn btn-dark mb-3"
                onClick={() => navigate(-1)}
            >
                Atras
            </button>
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top">
                    <h4 className="mb-0 d-flex align-items-center justify-content-between">
                        <span>
                            <FaObjectGroup className="me-2" />
                            Gestión de Grupos del {examn.title}
                        </span>
                        <div className="text-end">
                            <div>Total de estudiantes: {totalStudents}</div>
                            <div>Sin asignar: {unassignedStudents}</div>
                        </div>
                    </h4>
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
                                <th scope="col" className="fw-medium text-primary">Ubicacion</th>
                                <th scope="col" width="20%" className="text-center fw-medium text-primary">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.length > 0 ? (
                                groups.map((group, index) => {
                                    const startTime = group.start_time
                                        ? group.start_time.split(" ")[1]?.slice(0, 5)
                                        : "N/D";
                                    const endTime = group.end_time
                                        ? group.end_time.split(" ")[1]?.slice(0, 5)
                                        : "N/D";

                                    const studentCount = Array.isArray(group.students) ? group.students.length : 0;
                                    const labCapacity = group.lab?.equipment_count ?? "N/A";
                                    const labLocation = group.lab?.name ?? "Sin ubicación";

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
                                                    Ver estudiantes ({studentCount})
                                                </button>
                                            </td>
                                            <td className="text-center">{labCapacity}</td>
                                            <td className="text-center text-capitalize">{labLocation}</td>
                                            <td className="text-center">
                                                <ButtonEdit
                                                    idEditar={idEditar}
                                                    onEditClick={() => handleEditClick(group)}
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                                                />
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleStartGroup(group)}
                                                >
                                                    Iniciar examen
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-warning"
                                                    onClick={() => handlePauseGroup(group)}
                                                >
                                                    Pausar examen
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleResumeGroup(group)}
                                                >
                                                    Reaundar examen
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleStopGroup(group)}
                                                >
                                                    Detener examen
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-5">
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
                title="Editar Grupo"
                onClose={() => setShowEditModal(false)}
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
