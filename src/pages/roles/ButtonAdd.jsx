/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Tooltip } from "bootstrap";
import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ButtonAdd = () => {
  const navigate = useNavigate();
  useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new Tooltip(tooltipTriggerEl);
  });
}, []);
  const handleClick = () => {
    navigate("/administracion/roles/crear");
  };

  return (
    <button
      type="button"
      className="btn btn-outline-success d-flex align-items-center gap-2"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Crear un nuevo rol"
      onClick={handleClick}
    >
      <FaPlus />
      Agregar Rol
    </button>

  );
};

export default ButtonAdd;
