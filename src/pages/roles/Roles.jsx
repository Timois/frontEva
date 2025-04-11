import { useEffect } from "react";
import { useFetchRol } from "../../hooks/fetchRoles";
import ButtonEdit from "./ButtonEdit"; // Asegúrate de que ButtonEdit está importado correctamente
import CheckPermissions from "../../routes/CheckPermissions";

export const Roles = () => {
  const { roles, getData } = useFetchRol();

  useEffect(() => {
    getData(); // Obtener los roles al cargar el componente
  }, [getData]);

  return (
    <div className="row">
      <div className="col-12">
        <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
          <thead>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Nombre</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((permiso, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{permiso?.name}</td>
                  <td>
                    <CheckPermissions requiredPermission="editar-roles">
                    <ButtonEdit
                      roleId={permiso?.id} // Asegúrate de pasar el ID del rol
                    />
                    </CheckPermissions>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay Permisos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
