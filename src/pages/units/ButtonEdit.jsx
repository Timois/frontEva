/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const ButtonEdit = ({ idEditar,onEditClick }) => {
  return (
    <button
      type="button"
      className="btn btn-primary justify-content-end"
      data-bs-toggle="modal"
      data-bs-target={`#${idEditar}`}
      onClick={onEditClick}
    >
      Editar
    </button>
  )
}

export default ButtonEdit;