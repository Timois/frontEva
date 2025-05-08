/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/components/examns/ButtonOrderRandomQuestions.jsx

import Swal from 'sweetalert2'
import { postApi } from '../../services/axiosServices/ApiService'
import { FaClipboardList, FaRandom } from 'react-icons/fa'

export const ButtonOrderRandomQuestions = ({ examnId }) => {
  const handleRandomize = async () => {
    try {
      const { data } = await postApi('student_tests/assignRandomEvaluation', {
        evaluation_id: examnId
      })
      Swal.fire('Éxito', 'Preguntas asignadas aleatoriamente a cada estudiante.', 'success')
    } catch (error) {
      console.error(error)
      Swal.fire('Error', 'Hubo un problema al asignar preguntas.', 'error')
    }
  }

  return (
    <button
      type="button"
      className="btn btn-success btn-sm ms-2"
      title="Asignar preguntas"
      onClick={handleRandomize}
    >
      <FaRandom />
    </button>
  )
}
