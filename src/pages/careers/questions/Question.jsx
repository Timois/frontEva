/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { QuestionContext } from "../../../context/QuestionsProvider";
import { useFetchQuestionsByArea } from "../../../hooks/fetchQuestions";
import ButtonEdit from "./ButtonEdit";
import { ModalEdit } from "./ModalEdit";
import { MdAddPhotoAlternate } from "react-icons/md";
import { ModalImport } from "./imports/ModalImport";
import { ButtonImport } from "./imports/ButtonImport";
import CheckPermissions from "../../../routes/CheckPermissions";
import { useFetchArea } from "../../../hooks/fetchAreas";
import ButtonViewAnswers from "./ButtonViewAnswers";
const urlimages = import.meta.env.VITE_URL_IMAGES;


export const Question = () => {
    const { id } = useParams();
    const { questions, setQuestions } = useContext(QuestionContext);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;
    const { getData, areas } = useFetchArea();
    const { getDataQuestions } = useFetchQuestionsByArea();
    const navigate = useNavigate();
    // Get area name
    const areaName = areas?.find(area => String(area.id) === String(id))?.name.toUpperCase();

    useEffect(() => {
        const fetchData = async () => {
            await getData();
            if (id) {
                const questionsData = await getDataQuestions(id);
                setQuestions(questionsData);
            }
        };
        fetchData();
    }, [id]);

    const handleEditClick = (question) => {
        setSelectedQuestion(question);
    };

    // Pagination logic
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const totalPages = Math.ceil(questions.length / questionsPerPage);

    const changePage = (page) => setCurrentPage(page);
    const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
    const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));

    const truncateText = (text, maxLength) =>
        text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    const modalId = "registerPregunta";
    const idEditar = "editarPregunta";
    const IdImport = "importExcel";

    return (
        <div className="row">
            <div className="col-15">
                <button 
                    className="btn btn-warning mb-3"
                    onClick={() => navigate('/administracion/questions')}
                    style={{ marginLeft: '15px' }}
                >
                    <MdArrowBack /> Volver
                </button>
                
                <div className="table-responsive">
                    <div className="d-flex justify-content-between align-items-center my-3">
                        <h5 className="mb-0 px-4 py-2 rounded" style={{
                            color: '#2c3e50',
                            backgroundColor: '#cff193',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>{areaName}</h5>
                        <div className="d-flex gap-2">
                            {/* <CheckPermissions requiredPermission="crear-preguntas">
                                <ButtonAdd ModalId={modalId}/>
                            </CheckPermissions> */}
                            <CheckPermissions requiredPermission="importar-excel">
                                <ButtonImport modalIdImp={IdImport} />
                            </CheckPermissions>
                        </div>
                    </div>
                    <table className="table table-dark table-striped table-bordered border border-warning text-wrap">
                        <thead>
                            <tr>
                                <th scope="col">N°</th>
                                <th scope="col">Pregunta</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Dificultad</th>
                                <th scope="col">Imagen</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Respuestas</th>
                                <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentQuestions.length > 0 ? (
                                currentQuestions.map((question, index) => (
                                    <tr key={question.id || index}>
                                        <td>{indexOfFirstQuestion + index + 1}</td>
                                        <td className="text-break" style={{ fontSize: "15px" }}>
                                            {truncateText(question.question, 15)}
                                        </td>
                                        <td className="text-break" style={{ fontSize: "15px" }}>
                                            {truncateText(question.description, 15)}
                                        </td>
                                        <td className="text-break" style={{ fontSize: "15px" }}>{question.dificulty}</td>
                                        <td className="justify-content-center">
                                            {question.image ? (
                                                <button
                                                    className="btn btn-info btn-sm"
                                                    onClick={() => setModalImage(urlimages + question.image)}
                                                >
                                                    <MdAddPhotoAlternate />
                                                </button>
                                            ) : (
                                                <span className="badge badge-secondary" style={{ backgroundColor: "red" }}>Sin Imagen</span>
                                            )}
                                        </td>
                                        <td>{question.type}</td>
                                        <td>
                                            <CheckPermissions requiredPermission={"ver-respuestas"}>
                                                <ButtonViewAnswers questionId={question.id} />
                                            </CheckPermissions>
                                        </td>
                                        <td>
                                            <CheckPermissions requiredPermission="editar-preguntas">
                                                <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(question)} />
                                            </CheckPermissions>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No hay preguntas registradas para esta área.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {questions.length > questionsPerPage && (
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <button
                            className="btn btn-warning mx-1"
                            onClick={prevPage}
                        >
                            ⬅ Anterior
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`btn mx-1 ${currentPage === index + 1 ? "btn-primary" : "btn-outline-warning"}`}
                                onClick={() => changePage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className="btn btn-warning mx-1"
                            onClick={nextPage}
                        >
                            Siguiente ➡
                        </button>
                    </div>
                )}
            </div>

            <CheckPermissions requiredPermission="editar-preguntas">
                <ModalEdit idEditar={idEditar} data={selectedQuestion} title="Editar Pregunta" />
            </CheckPermissions>
            <CheckPermissions requiredPermission="importar-excel">
                <ModalImport modalIdImp={IdImport} title={"Importar Preguntas"} />
            </CheckPermissions>
            {/* <CheckPermissions requiredPermission="crear-preguntas">
                <ModalRegister ModalId={modalId} title="Crear Pregunta" />
            </CheckPermissions> */}

            {modalImage && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Pregunta</h5>
                                <button className="btn-close" onClick={() => setModalImage(null)}></button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={modalImage} alt="Vista previa" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
