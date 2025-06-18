import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';;
import { getApi, postApi } from '../../services/axiosServices/ApiService';
import { customAlert } from '../../utils/domHelper';
import { useStudentTest } from '../../hooks/fetchStudentTest';

const IndexResults = () => {
  const { id: studentTestId } = useParams();
  const [questionsData, setQuestionsData] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchQuestionsByStudentTest } = useStudentTest();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetchQuestionsByStudentTest(studentTestId);
        setQuestionsData(response);
        
        // Inicializar las respuestas seleccionadas
        const initialAnswers = {};
        response.questions.forEach(question => {
          initialAnswers[question.id] = null;
        });
        setSelectedAnswers(initialAnswers);

        const studentResponse = await getApi(`students/find/${response.student_id}`);
        setStudentName(`${studentResponse.name} ${studentResponse.paternal_surname} ${studentResponse.maternal_surname}`);

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

  const handleAnswerSelection = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Verificar que todas las preguntas estén respondidas
      const unansweredQuestions = Object.values(selectedAnswers).includes(null);
      if (unansweredQuestions) {
        customAlert("Por favor responde todas las preguntas", "warning");
        return;
      }

      // Preparar datos para enviar
      const answersData = {
        student_test_id: studentTestId,
        answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
          question_id: questionId,
          selected_answer_id: answerId
        }))
      };

      // Enviar respuestas
      const response = await postApi('student-answers/save', answersData);
      
      if (response.status === 200) {
        customAlert("Examen enviado correctamente", "success");
        // Aquí puedes redirigir al estudiante a una página de confirmación
      }
    } catch (error) {
      customAlert(error.response?.data?.message || "Error al enviar el examen", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;

  if (loading) return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!questionsData || !questionsData.questions) {
    return <div className="alert alert-info m-4">No se encontraron preguntas para esta prueba.</div>;
  }

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Examen: {evaluationTitle}</h3>
          </div>
          <div className="card-body">
            <div className="mb-2">
              <strong>Estudiante:</strong> {studentName}
            </div>
          </div>
        </div>

        <div className="questions-container">
          {questionsData.questions.map((question, index) => (
            <div key={question.id} className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Pregunta {index + 1}</h5>
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
                    <div key={answer.id} className="form-check mb-2">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        id={`answer-${answer.id}`}
                        className="form-check-input"
                        onChange={() => handleAnswerSelection(question.id, answer.id)}
                        checked={selectedAnswers[question.id] === answer.id}
                      />
                      <label className="form-check-label" htmlFor={`answer-${answer.id}`}>
                        {answer.answer}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-grid gap-2 col-6 mx-auto mb-4">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Enviando...
              </>
            ) : 'Enviar Examen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IndexResults;
