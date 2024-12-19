/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

export const AssignPeriod = () => {

  return (
    <button
      className="btn btn-primary" style={{backgroundColor: '#5dbf1a', color: 'white'}}
      data-bs-toggle="modal"
      data-bs-target={`#asignarPeriodo`}
    >
      Asignar Periodo
    </button>
  )
}
