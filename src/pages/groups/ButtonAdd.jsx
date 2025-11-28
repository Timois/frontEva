/* eslint-disable react/prop-types */

import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const ButtonAdd = () => {
  const { id } = useParams();  // <- sacar el id correctamente
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="btn btn-secondary justify-content-end"
      style={{ backgroundColor: "#5dbf1a", color: "white" }}
      onClick={() => navigate(`/administracion/examns/${id}/groups/register`)}
    >
      <FaPlus className="me-2" />
      Registrar Grupo
    </button>
  );
};

export default ButtonAdd;
