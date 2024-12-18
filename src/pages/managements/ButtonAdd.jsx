/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const ButtonAdd = ({ modalIdG }) => {
  return (
    <button
      type="button"
      className="btn btn-secondary justify-content-end" style={{backgroundColor: '#5dbf1a', color: 'white'}}
      data-bs-toggle="modal"
      data-bs-target={`#${modalIdG}`}
    >
      Agregar Gestion
    </button>
  )
}

export default ButtonAdd;