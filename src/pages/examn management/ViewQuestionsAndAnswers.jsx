/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';  // Importa axios para la petición POST
import { getApi, postApi } from '../../services/axiosServices/ApiService';
import { useFetchStudent } from '../../hooks/fetchStudent';

const ViewQuestionsAndAnswers = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { getTestStudent } = useFetchStudent();
  
  const student = JSON.parse(localStorage.getItem('user'));
  const ci = student ? student.ci : null;

  const handleAnswerSelection = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      student_test_id: questionsData.student_test_id,
      answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        question_id: Number(questionId),
        answer_id: answerId,
      })),
    };

    try {
      setLoading(true);
      // Cambia esta URL a la que corresponda en tu backend Laravel
      const response = await postApi('student_answers/save', payload);

      alert('Respuestas guardadas correctamente');
      // Aquí puedes hacer redirección o limpiar estado si quieres
    } catch (error) {
      console.error('Error al guardar respuestas:', error);
      alert(
        error?.response?.data?.message || 
        'Ocurrió un error al enviar las respuestas. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      if (!ci) {
        setError('No se encontró información del estudiante');
        setLoading(false);
        return;
      }

      try {
        // Obtener el test del estudiante
        const studentId = await getApi(`student_evaluations/list/${ci}`);
        if (!isMounted) return;

        if (!studentId) {
          setError('No se encontró ninguna evaluación para este estudiante');
          return;
        }

        // Obtener las preguntas del test
        const response = await getTestStudent(studentId);
        console.log('Respuesta del test:', response); 
        if (!isMounted) return;
        
        setQuestionsData(response);
        setStudentName('');
      
        // Obtener el título de la evaluación
        const evaluationResponse = await getApi(`student_evaluations/find/${response.evaluation_id}`);
        if (!isMounted) return;
        
        setEvaluationTitle(evaluationResponse.title);
      } catch (err) {
        if (isMounted) {
          console.error('Error:', err);
          setError(err?.response?.data?.message || 'Error al cargar datos');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [ci]);

  if (loading) return <p>Cargando preguntas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!questionsData || !questionsData.questions) {
    return <p>No se encontraron preguntas para esta prueba.</p>;
  }

  const API_BASE_URL = import.meta.env.VITE_URL_IMAGES;
  
  return (
    <form onSubmit={handleSubmit} className="container mt-4">
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
                    className={`p-3 mb-2 rounded cursor-pointer ${
                      selectedAnswers[question.id] === answer.id
                        ? 'bg-primary bg-opacity-10 border border-primary'
                        : 'bg-light'
                    }`}
                    onClick={() => handleAnswerSelection(question.id, answer.id)}
                    role="button"
                  >
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        checked={selectedAnswers[question.id] === answer.id}
                        onChange={() => handleAnswerSelection(question.id, answer.id)}
                        className="me-2"
                      />
                      {answer.answer}
                    </div>
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
          disabled={loading}
        >
          Enviar Respuestas
        </button>
      </div>
    </form>
  );
};

export default ViewQuestionsAndAnswers;
