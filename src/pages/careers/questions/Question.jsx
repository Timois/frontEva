/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuestionContext } from "../../../context/QuestionsProvider";
import { useFetchQuestionsByArea } from "../../../hooks/fetchQuestions";
import ButtonEdit from "./ButtonEdit";
import { ModalEdit } from "./ModalEdit";
import CheckPermissions from "../../../routes/CheckPermissions";
import { useFetchArea } from "../../../hooks/fetchAreas";
import ButtonViewAnswers from "./ButtonViewAnswers";
import ReactPaginate from "react-paginate";
import { MdAddPhotoAlternate, MdArrowBack } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaQuestionCircle } from "react-icons/fa";

const urlimages = import.meta.env.VITE_URL_IMAGES;

export const Question = () => {
    const { id } = useParams();
    const { questions, setQuestions } = useContext(QuestionContext);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 5;
    const { getDataArea, areas } = useFetchArea();
    const { getDataQuestions } = useFetchQuestionsByArea();

    const areaName = areas?.find(area => String(area.id) === String(id))?.name;
    const areaId = areas?.find(area => String(area.id) === String(id))?.id;
    
    useEffect(() => {
        const fetchData = async () => {
            await getDataArea();
            const questionsData = await getDataQuestions(id);
            setQuestions(questionsData);
        };
        fetchData();
    }, [id]);

    const handleEditClick = (question) => {
        setSelectedQuestion(question);
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * questionsPerPage;
    const currentQuestions = questions.slice(offset, offset + questionsPerPage);
    const pageCount = Math.ceil(questions.length / questionsPerPage);

    const truncateText = (text, maxLength) =>
        text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    const modalId = "registerPregunta";
    const idEditar = "editarPregunta";

    const navigate = useNavigate();
    return (
        <div className="container-fluid p-4">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-primary mb-3 w-auto d-inline-flex align-items-center px-3 py-2"
            >
                <MdArrowBack className="me-1" /> Volver
            </button>
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-primary text-white py-3 rounded-top">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">
                            <FaQuestionCircle className="me-2" />
                            Preguntas {areaName && `- ${areaName.toUpperCase()}`}
                        </h3>
                    </div>
                </div>

                {/* Tabla */}
                <div className="table-responsive rounded-3">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="text-center">
                                <th scope="col" width="5%" className="fw-medium text-primary">N°</th>
                                <th scope="col" width="20%" className="fw-medium text-primary">Pregunta</th>
                                <th scope="col" width="20%" className="fw-medium text-primary">Descripción</th>
                                <th scope="col" width="10%" className="fw-medium text-primary">Dificultad</th>
                                <th scope="col" width="10%" className="fw-medium text-primary">Imagen</th>
                                <th scope="col" width="10%" className="fw-medium text-primary">Tipo</th>
                                <th scope="col" width="15%" className="fw-medium text-primary">Respuestas</th>
                                <th scope="col" width="10%" className="fw-medium text-primary">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentQuestions.length > 0 ? (
                                currentQuestions.map((question, index) => (
                                    <tr key={question.id || index} className="transition-all">
                                        <td className="text-center fw-bold text-muted">{offset + index + 1}</td>
                                        <td className="text-break">
                                            {truncateText(question.question, 50)}
                                        </td>
                                        <td className="text-break">
                                            {truncateText(question.description, 50)}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${question.dificulty === 'Fácil' ? 'bg-success' :
                                                    question.dificulty === 'Media' ? 'bg-warning' : 'bg-danger'
                                                } bg-opacity-10 ${question.dificulty === 'Fácil' ? 'text-success' :
                                                    question.dificulty === 'Media' ? 'text-warning' : 'text-danger'
                                                } py-2 px-3`}>
                                                {question.dificulty}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {question.image ? (
                                                <button
                                                    className="btn btn-sm btn-outline-info"
                                                    onClick={() => setModalImage(urlimages + question.image)}
                                                >
                                                    <MdAddPhotoAlternate />
                                                </button>
                                            ) : (
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary py-2 px-3">
                                                    Sin imagen
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center text-muted">{question.type}</td>
                                        <td className="text-center">
                                            <CheckPermissions requiredPermission="ver-respuestas">
                                                <ButtonViewAnswers
                                                    questionId={question.id}
                                                    className="btn btn-sm btn-outline-primary"
                                                />
                                            </CheckPermissions>
                                        </td>
                                        <td className="text-center">
                                            <CheckPermissions requiredPermission="editar-preguntas">
                                                <ButtonEdit
                                                    idEditar={idEditar}
                                                    onEditClick={() => handleEditClick(question)}
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                                                />
                                            </CheckPermissions>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center text-muted">
                                            <FaQuestionCircle className="fs-1 mb-2" />
                                            No hay preguntas registradas para esta área.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {questions.length > questionsPerPage && (
                    <div className="card-footer bg-transparent border-0">
                        <div className="d-flex justify-content-center">
                            <ReactPaginate
                                previousLabel={<FaChevronLeft />}
                                nextLabel={<FaChevronRight />}
                                breakLabel={"..."}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination pagination-sm"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                activeClassName={"active"}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}
            <CheckPermissions requiredPermission="editar-preguntas">
                <ModalEdit
                    idEditar={idEditar}
                    data={selectedQuestion}
                    title="Editar Pregunta"
                />
            </CheckPermissions>

            {/* Modal de imagen */}
            {modalImage && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Imagen de la pregunta</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setModalImage(null)}
                                ></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <img
                                    src={modalImage}
                                    alt="Vista previa"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: "70vh" }}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setModalImage(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};