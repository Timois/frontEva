// src/components/examns/ButtonViewStudentsWithTest.jsx
/* eslint-disable react/prop-types */
import { FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export const ButtonViewGroups = ({ examnId }) => {
  return (
    <Link to={`/administracion/examns/${examnId}/groups`}
      className="btn btn-success btn-sm ms-2"
    >
      <FaUsers /> Ver Grupos
    </Link>
  )
}
