// src/components/examns/ButtonViewStudentsWithTest.jsx
/* eslint-disable react/prop-types */
import { FaUsers } from 'react-icons/fa'

export const ButtonViewStudentsWithTest = ({ examnId }) => {
  return (
    <button
      type="button"
      className="btn btn-info btn-sm ms-2"
      title="Ver estudiantes con prueba"
      data-bs-toggle="modal"
      data-bs-target={`#modalEstudiantes-${examnId}`}
    >
      <FaUsers />
    </button>
  )
}
