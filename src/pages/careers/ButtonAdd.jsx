/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

export const ButtonAdd = ({ modalIdCareer }) => {
    return (
      <button
        type="button"
        className="btn btn-secondary justify-content-end"
        data-bs-toggle="modal"
        data-bs-target={`#${modalIdCareer}`}
      >
        Agregar
      </button>
    )
  }
