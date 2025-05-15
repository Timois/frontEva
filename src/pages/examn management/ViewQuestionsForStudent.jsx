/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { useFetchExamns } from '../../hooks/fetchExamns';
import { getApi } from '../../services/axiosServices/ApiService';

const ViewQuestionsForStudent = () => {
  const { id: studentTestId } = useParams(); 
  const [questionsData, setQuestionsData] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchStudenttestStudent } = useFetchExamns();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetchStudenttestStudent(studentTestId);
        setQuestionsData(response);

        // Fetch student name
        const studentResponse = await getApi(`students/find/${response.student_id}`);
        setStudentName(`${studentResponse.name} ${studentResponse.paternal_surname} ${studentResponse.maternal_surname}`);

        // Fetch evaluation title
        const evaluationResponse = await getApi(`evaluations/find/${response.evaluation_id}`);
        setEvaluationTitle(evaluationResponse.title);
      } catch (err) {
        setError(err?.response?.data?.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    if (studentTestId) {
      fetchAllData();
    }
  }, [studentTestId]);

  if (loading) return <p>Cargando preguntas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!questionsData || !questionsData.questions) {
    return <p>No se encontraron preguntas para esta prueba.</p>;
  }

  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Detalles de la Prueba</h3>
        </div>
        <div className="card-body">
          <div className="mb-2">
            <strong>Número de Prueba:</strong> {questionsData.student_test_id}
          </div>
          <div className="mb-2">
            <strong>Estudiante:</strong> {studentName}
          </div>
          <div className="mb-2">
            <strong>Evaluación:</strong> {evaluationTitle}
          </div>
        </div>
      </div>

      <div className="questions-container">
        {questionsData.questions.map((question, index) => (
          <div key={question.id} className="card mb-4">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Pregunta {index + 1}</h5>
              </div>
            </div>
            <div className="card-body">
              <p className="fw-bold mb-2">{question.question}</p>
              
              {question.image && (
                <div className="text-center mb-4">
                  <img 
                    src={`${API_BASE_URL}${question.image}`}
                    alt="Imagen de la pregunta"
                    className="img-fluid rounded"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}

              <p className="text-muted mb-4">{question.description}</p>

              <div className="answers-container">
                {question.bank_answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`p-3 mb-2 rounded ${
                      answer.is_correct
                        ? 'bg-success bg-opacity-10 border border-success'
                        : 'bg-light'
                    }`}
                  >
                    <div className="d-flex align-items-center">
                      <span className={`me-2 ${answer.is_correct ? 'text-success' : ''}`}>
                        {answer.is_correct ? '✓' : '○'}
                      </span>
                      {answer.answer}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <small className="text-muted">
                  Tipo de pregunta: {question.question_type} | Tipo de respuesta: {question.type}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewQuestionsForStudent;