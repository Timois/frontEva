/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { FaPlus } from "react-icons/fa";

const ButtonAdd = ({ modalId }) => {
  return (
    <button
      type="button"
      className="btn btn-info justify-content-end"
      style={{ backgroundColor: '#5dbf1a', color: 'white' }}
      data-bs-toggle="modal"
      data-bs-target={`#${modalId}`}
    >
      <FaPlus className="me-2" /> Agregar Unidad Académica
    </button>
  );
};

export default ButtonAdd;
