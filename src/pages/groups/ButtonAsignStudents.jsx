import React from 'react'
import { IoAddCircleOutline } from 'react-icons/io5';

export const ButtonAsignStudents = ({ modalId, onClick }) => {
    return (
        <button
            type="button"
            className="btn btn-secondary justify-content"
            style={{ backgroundColor: "#58bd14ff", color: "white" }}
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
            onClick={onClick} 
        >
            <IoAddCircleOutline className="me-2" />
            Asignar Estudiantes
        </button>
    );
};
