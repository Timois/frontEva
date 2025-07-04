/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { FaEdit } from "react-icons/fa"; // Importa el ícono

const ButtonEdit = ({ idEditar, onEditClick }) => {
  return (
    <button
      type="button"
      className="d-flex btn btn-primary justify-content-end p-2 m-2"
      style={{ backgroundColor: '#fa8c07', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
      data-bs-toggle="modal"
      data-bs-target={`#${idEditar}`}
      onClick={onEditClick}
    >
      <FaEdit size={16} />
      Editar
    </button>
  );
};

export default ButtonEdit;
