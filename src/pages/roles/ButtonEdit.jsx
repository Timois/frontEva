/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { FaEdit } from "react-icons/fa"; // Importa el ícono
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate de React Router

const ButtonEdit = ({ roleId }) => {
  const navigate = useNavigate(); // Hook para navegar a otras vistas

  const handleEditClick = () => {
    // Redirige a la vista de edición usando el roleId
    navigate(`/administracion/roles/${roleId}/editar`);
  };

  return (
    <button
      type="button"
      className="btn btn-primary justify-content-end"
      style={{ backgroundColor: '#fa8c07', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
      onClick={handleEditClick} // Llama a handleEditClick en lugar de mostrar un modal
    >
      <FaEdit size={16} /> {/* Agrega el ícono aquí */}
      Editar {/* Puedes eliminar este texto si solo quieres el ícono */}
    </button>
  );
};

export default ButtonEdit;
