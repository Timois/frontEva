/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const ButtonAdd = ({ modalId }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary justify-content-end"
      data-bs-toggle="modal"
      data-bs-target={`#${modalId}`}
    >
      Agregar
    </button>
  )
}

export default ButtonAdd;