import React from 'react'
import { IoAddCircleOutline } from 'react-icons/io5';

export const ButtonAsignStudents = ({modalId}) => {
    return (
        <button
            type="button"
            className="btn btn-secondary justify-content " style={{ backgroundColor: "#5dbf1a", color: "white" }}
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
        >
            <IoAddCircleOutline className="me-2" />Asignar Estudiantes
        </button>
    )
}
