/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { FaEdit } from "react-icons/fa"; // Importa el ícono

const ButtonEdit = ({ idEditar, onEditClick }) => {
  return (
    <button
      type="button"
      className="btn btn-primary justify-content-end"
      style={{ backgroundColor: '#fa8c07', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
      data-bs-toggle="modal"
      data-bs-target={`#${idEditar}`}
      onClick={onEditClick}
    >
      <FaEdit size={16} /> {/* Agrega el ícono aquí */}
      
    </button>
  );
};

export default ButtonEdit;
