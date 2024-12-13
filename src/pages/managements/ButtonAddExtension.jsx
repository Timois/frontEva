/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const ButtonAddExtension = ({ modalIdE }) => {
  return (
    <button
      type="button"
      className="btn justify-content-end" style={{backgroundColor: '#0b7e31', color: 'white'}}
      data-bs-toggle="modal"
      data-bs-target={`#${modalIdE}`}
    >
      Extender
    </button>
  )
}

export default ButtonAddExtension;