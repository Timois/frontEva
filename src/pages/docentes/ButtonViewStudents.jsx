/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"


// eslint-disable-next-line no-unused-vars
export const ButtonViewStudents = ({examnId}) => {
  return (
    <Link to={`/administracion/examns/${examnId}/students`}
      title="Ver estudiantes"
      className="btn btn-primary"   
    >
      Ver estudiantes
    </Link>
  )
}
