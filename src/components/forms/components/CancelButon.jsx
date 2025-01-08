/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const CancelButton = ({ onClick, disabled, label = "Cancelar" }) => {
  return (
    <button 
      type="button" 
      className="btn btn-danger" 
      onClick={onClick} 
      disabled={disabled}
      data-bs-dismiss="modal"
    >
      <span>{label}</span>
    </button>
  );
};

export default CancelButton;