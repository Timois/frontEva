/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { getApi } from '../../services/axiosServices/ApiService'

export const ModalStudentsWithTest = ({ examnId }) => {
  const [students, setStudents] = useState([])

  useEffect(() => {
    const modal = document.getElementById(`modalEstudiantes-${examnId}`)

    const fetchStudents = async () => {
      try {
        const response = await getApi(`student_tests/findStudentsByEvaluation/${examnId}`)
        // Aquí ya no es necesario acceder a `data`, ya que la respuesta es el array directamente
        const studentsData = response
        if (Array.isArray(studentsData)) {
          setStudents(studentsData)
        } else {
          setStudents([])
        }
      } catch (error) {
        console.error('Error al cargar estudiantes:', error)
        setStudents([])
      }
    }
    const handleShow = () => {
      fetchStudents()
    }

    // Escuchar evento al abrir el modal
    modal?.addEventListener('show.bs.modal', handleShow)

    return () => {
      modal?.removeEventListener('show.bs.modal', handleShow)
    }
  }, [examnId])

  return (
    <div
      className="modal fade"
      id={`modalEstudiantes-${examnId}`}
      tabIndex="-1"
      aria-labelledby={`modalEstudiantesLabel-${examnId}`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`modalEstudiantesLabel-${examnId}`}>
              Estudiantes asignados al examen
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {students.length > 0 ? (
              <ul className="list-group">
                {students.map((item) => (
                  <li key={item.id} className="list-group-item">
                    <strong>{item.student?.name ?? ''} {item.student?.paternal_surname ?? ''} {item.student?.maternal_surname ?? ''}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay estudiantes asignados a esta prueba.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
