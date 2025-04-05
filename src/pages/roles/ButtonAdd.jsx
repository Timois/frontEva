/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate

const ButtonAdd = () => {
  const navigate = useNavigate(); // Inicializamos useNavigate

  const handleClick = () => {
    navigate("/administracion/roles/crear"); // Redirige a la vista de crear rol
  };

  return (
    <button
      type="button"
      className="btn btn-secondary justify-content-end"
      style={{ backgroundColor: "#5dbf1a", color: "white" }}
      onClick={handleClick} // Usa onClick para navegar
    >
      <FaPlus className="me-2" /> Agregar Rol
    </button>
  );
};

export default ButtonAdd;
