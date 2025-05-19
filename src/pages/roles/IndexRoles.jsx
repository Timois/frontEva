
import CheckPermissions from "../../routes/CheckPermissions";
import ButtonAdd from "./ButtonAdd";
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
        <CheckPermissions requiredPermission="crear-roles">
        <ButtonAdd onClick={handleAddRoleClick} />
        </CheckPermissions>
      </div>

      <div className="w-100 d-flex justify-content-center mt-4">
        {/* Componente para listar los roles */}
        <Roles />
      </div>
    </div>
  );
};
