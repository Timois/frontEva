/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getApi, postApi } from '../../services/axiosServices/ApiService';
import { useFetchStudent } from '../../hooks/fetchStudent';


const ViewQuestionsAndAnswers = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const { getTestStudent } = useFetchStudent();
  const student = JSON.parse(localStorage.getItem('user'));
  const ci = student ? student.ci : null;
  const [studentName] = useState(student ? student.nombre_completo : '');
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (timer && !alreadyAnswered) {
      setTimeLeft(timer * 60); // Convertir minutos a segundos
      
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleSubmit({ preventDefault: () => {} }); // Auto-submit cuando se acaba el tiempo
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, alreadyAnswered]);

  // Función para formatear el tiempo
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
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
        answer_id: answerId
      })),
    };

    try {
      setLoading(true);
      const response = await postApi('student_answers/save', payload);
      const totalScore = Math.floor(response.total_score);

      setFinalScore(totalScore);
      setAlreadyAnswered(true);
    } catch (error) {
      console.error('Error al guardar respuestas:', error);

      if (error?.response?.status === 409) {
        setAlreadyAnswered(true);
        setFinalScore(null); // O puedes hacer un fetch de la nota si está disponible
      } else {
        alert(
          error?.response?.data?.message ||
          'Ocurrió un error al enviar las respuestas. Intenta nuevamente.'
        );
      }
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
        const studentId = await getApi(`student_evaluations/list/${ci}`);
        if (!isMounted) return;

        if (!studentId) {
          setError('No se encontró ninguna evaluación para este estudiante');
          return;
        }

        const response = await getTestStudent(studentId);
        if (!isMounted) return;

        setQuestionsData(response);
        // Eliminamos esta línea ya que el nombre lo obtenemos del localStorage
        // setStudentName('');

        const evaluationResponse = await getApi(`student_evaluations/find/${response.evaluation_id}`);
        if (!isMounted) return;

        setEvaluationTitle(evaluationResponse.title);
        setTimer(evaluationResponse.time);
        // 🔍 CONSULTAR SI YA RESPONDIÓ
        const answeredResp = await getApi(`student_answers/list/${response.student_test_id}`);
        if (!isMounted) return;

        if (answeredResp.answered) {
          setAlreadyAnswered(true);
          setFinalScore(Math.round(answeredResp.score));
        }

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

  // Mostrar mensaje si ya respondió el examen
  if (alreadyAnswered) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info text-center">
          <h4>Ya has respondido esta evaluación.</h4>
          {finalScore !== null ? (
            <p>Tu nota final es: <strong>{finalScore}</strong></p>
          ) : (
            <p>No puedes volver a enviar tus respuestas.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Detalles de la Prueba</h3>
            {timeLeft !== null && (
              <div className="bg-light text-dark px-3 py-2 rounded">
                <strong>Tiempo restante: </strong>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
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
                    className={`p-3 mb-2 rounded cursor-pointer ${selectedAnswers[question.id] === answer.id
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
          disabled={loading || timeLeft === 0}
        >
          {timeLeft === 0 ? 'Tiempo Agotado' : 'Enviar Respuestas'}
        </button>
      </div>
    </form>
  );
};

export default ViewQuestionsAndAnswers;
