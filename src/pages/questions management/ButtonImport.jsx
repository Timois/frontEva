/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import { FaPlus } from 'react-icons/fa'

export const ButtonImport = ({modalIdImp}) => {
  return (
    <button
          type="button"
          className="btn btn-secondary justify-content-end" style={{backgroundColor: '#5dbf1a', color: 'white'}}
          data-bs-toggle="modal"
          data-bs-target={`#${modalIdImp}`}
        >
          <FaPlus className="me-2" /> Subir Preguntas
        </button>
  )
}
