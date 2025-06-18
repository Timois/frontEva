import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuestionEvaluations } from "../../hooks/fetchQuestionEvaluations";

export const ViewQuestionsAssigned = () => {
    const { id } = useParams();
    const { fetchQuestionsAssigned } = useQuestionEvaluations();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const data = await fetchQuestionsAssigned(id);
                setQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        };
        loadQuestions();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }
    
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Preguntas Asignadas</h2>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Evaluación ID</th>
                            <th>Pregunta ID</th>
                            <th>Puntaje</th>
                            <th>Fecha de Creación</th>
                            <th>Última Actualización</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.length > 0 ? (
                            questions.map((question,index) => (
                                <tr key={question.id}>
                                    <td>{index+1}</td>
                                    <td>{question.evaluation_id}</td>
                                    <td>{question.question_id}</td>
                                    <td>{question.score}</td>
                                    <td>{new Date(question.created_at).toLocaleDateString()}</td>
                                    <td>{new Date(question.updated_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No hay preguntas asignadas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
