/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { QuestionContext } from "../../../context/QuestionsProvider";
import { useFetchQuestions } from "../../../hooks/fetchQuestions";
import ButtonEdit from "./ButtonEdit";
import { ModalEdit } from "./ModalEdit";
import { MdAddPhotoAlternate } from "react-icons/md";
import { AreaContext } from "../../../context/AreaProvider";
const urlimages = import.meta.env.VITE_URL_IMAGES;

export const Question = ({ areaId }) => {
    const { areas, setAreas } = useContext(AreaContext);
    const { questions, setQuestions } = useContext(QuestionContext);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [modalImage, setModalImage] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;

    const handleEditClick = (question) => {
        setSelectedQuestion(question);
    };

    const { getData } = useFetchQuestions();

    useEffect(() => {
        getData();
    }, []);

    // Filtrar preguntas por área si se proporciona un areaId
    const filteredQuestions = areaId 
        ? questions.filter(q => String(q.area_id) === String(areaId))
        : questions;

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

    const changePage = (page) => setCurrentPage(page);
    const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
    const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));

    const truncateText = (text, maxLength) =>
        text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    const idEditar = "editarPregunta";
    
    return (
        <div className="row">
            <div className="col-15">
                <div className="table-responsive">
                    <table className="table table-dark table-striped table-bordered border border-warning text-wrap">
                        <thead>
                            <tr>
                                <th scope="col">N°</th>
                                <th scope="col">Pregunta</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Dificultad</th>
                                <th scope="col">Tipo de Pregunta</th>
                                <th scope="col">Imagen</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentQuestions.length > 0 ? (
                                currentQuestions.map((question, index) => (
                                    <tr key={index}>
                                        <td>{indexOfFirstQuestion + index + 1}</td>
                                        <td className="text-break" style={{ fontSize: "15px" }}>
                                            {truncateText(question.question, 15)}
                                        </td>
                                        <td className="text-break" style={{ fontSize: "15px" }}>
                                            {truncateText(question.description, 15)}
                                        </td>
                                        <td className="text-break" style={{ fontSize: "15px" }}>{question.dificulty}</td>
                                        <td className="text-break" style={{ fontSize: "15px" }}>{question.question_type}</td>
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
                                            <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(question)} />
                                            
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

                {filteredQuestions.length > questionsPerPage && (
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <button className="btn btn-warning mx-1" onClick={prevPage}>
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

                        <button className="btn btn-warning mx-1" onClick={nextPage}>
                            Siguiente ➡
                        </button>
                    </div>
                )}
            </div>
            <ModalEdit idEditar={idEditar} data={selectedQuestion} title="Editar Pregunta" />
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