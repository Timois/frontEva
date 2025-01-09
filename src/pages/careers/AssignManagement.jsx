/* eslint-disable no-unused-vars */
import React from 'react'
import { MdAssignment } from "react-icons/md";
 
export const AssignManagement = () => {

  return (
    <button
      className="btn btn-primary" style={{backgroundColor: '#5dbf1a', color: 'white'}}
      data-bs-toggle="modal"
      data-bs-target="#asignarGestion"
    >
      <MdAssignment className="me-2" />Asignar Gestion
    </button>
  )
}
