
import { Roles } from "./Roles"; // Suponiendo que este componente lista los roles
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate

export const IndexRoles = () => {
  const navigate = useNavigate(); // Usamos useNavigate

  const handleAddRoleClick = () => {
    navigate("/administracion/roles/crear"); // Navegamos a la vista para crear un nuevo rol
  };

  return (
    <div className="m-3 p-3">
      <div className="d-flex justify-content-center">
        {/* Botón para agregar un nuevo rol, redirige a la vista de creación */}
        <button
          type="button"
          className="btn btn-secondary justify-content-end"
          style={{ backgroundColor: "#5dbf1a", color: "white" }}
          onClick={handleAddRoleClick} // Redirige al hacer clic
        >
          <i className="fas fa-plus me-2"></i> Agregar Rol
        </button>
      </div>

      <div className="w-100 d-flex justify-content-center mt-4">
        {/* Componente para listar los roles */}
        <Roles />
      </div>
    </div>
  );
};
