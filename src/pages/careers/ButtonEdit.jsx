/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

export const ButtonEdit = ({ idEditar,onEditClick }) => {
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