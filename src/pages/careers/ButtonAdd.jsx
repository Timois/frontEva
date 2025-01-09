/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { FaPlus } from "react-icons/fa";

export const ButtonAdd = ({ modalIdCareer }) => {
    return (
      <button
        type="button"
        className="btn btn-secondary justify-content-center " style={{backgroundColor: '#5dbf1a', color: 'white'}}
        data-bs-toggle="modal"
        data-bs-target={`#${modalIdCareer}`}
      >
        <FaPlus className="me-2" />Agregar Carrera
      </button>
    )
  }
