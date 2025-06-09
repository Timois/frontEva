/* eslint-disable react/prop-types */

import { FaPlus } from "react-icons/fa";

const ButtonAdd = ({ modalId }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary justify-content-end" style={{backgroundColor: '#5dbf1a', color: 'white'}}
      data-bs-toggle="modal"
      data-bs-target={`#${modalId}`}
    >
      <FaPlus className="me-2" />Registrar Laboratorio
    </button>
  )
}

export default ButtonAdd