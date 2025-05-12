/* eslint-disable react/prop-types */

import { CiViewTable } from "react-icons/ci"

export const ButtonViewAnswerStudent = ({examnId}) => {
  return (
    <button
      type="button"
      className="btn btn-info btn-sm ms-2"
      title="Ver estudiantes con prueba"
      data-bs-toggle="modal"
      data-bs-target={`#modalEstudiantes-${examnId}`}
    >
      <CiViewTable />
    </button>
  )
}
