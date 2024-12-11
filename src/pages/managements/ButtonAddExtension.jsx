/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const ButtonAddExtension = ({ modalIdE }) => {
  return (
    <button
      type="button"
      className="btn btn-success justify-content-end"
      data-bs-toggle="modal"
      data-bs-target={`#${modalIdE}`}
    >
      Extender
    </button>
  )
}

export default ButtonAddExtension;