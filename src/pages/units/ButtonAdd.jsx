/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const ButtonAdd = ({ modalId }) => {
  return (
    <button
      type="button"
      className="btn btn-info justify-content-end" style={{backgroundColor: '#5dbf1a', color: 'white'}}
      data-bs-toggle="modal"
      data-bs-target={`#${modalId}`}
    > 
      Agregar Unidad Academica
    </button>
  )
}

export default ButtonAdd;
